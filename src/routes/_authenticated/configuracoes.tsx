import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bot, CheckCircle2, Cpu, Key, RefreshCw, Zap } from "lucide-react";

import { EmptyState, PageHeader, Tag } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useRows } from "@/lib/data";
import { ROLES, dateBR } from '@/lib/domain';
import { saveMetaToken } from '@/lib/auth/metaTokens';
import {
  getMCPIntegrations,
  saveMCPIntegration,
  type MCPIntegrationStatus,
  type MCPProvider,
} from "@/lib/ai/mcp-connectors";

export const Route = createFileRoute("/_authenticated/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — Creative OS" },
      {
        name: "description",
        content: "Workspace, equipe, papéis e integrações MCP de IA (Meta e Google).",
      },
      { property: "og:title", content: "Configurações — Creative OS" },
      { property: "og:description", content: "Ajuste workspace, equipe e integrações de IA/MCP." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { workspaceId, workspaceName, user, role } = useAuth();
  const members = useRows<{ id: string; user_id: string; role: string; created_at: string }>(
    "workspace_members",
    workspaceId,
    { orderBy: "created_at", ascending: true },
  );
  const [invite, setInvite] = useState("");
  const [mcpList, setMcpList] = useState<MCPIntegrationStatus[]>([]);
  const [loadingMcp, setLoadingMcp] = useState(false);
  const [selectedMcp, setSelectedMcp] = useState<MCPIntegrationStatus | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState("");

  useEffect(() => {
    if (workspaceId) {
      setLoadingMcp(true);
      getMCPIntegrations(workspaceId).then((res) => {
        setMcpList(res);
        setLoadingMcp(false);
      });
    }
  }, [workspaceId]);

  async function handleToggleMcp(provider: MCPProvider, currentStatus: string) {
    if (!workspaceId) return;
    const newStatus = currentStatus === "connected" ? "disconnected" : "connected";
    let ok = false;
    if (provider === "meta") {
      // Meta integration requires a token stored separately
      if (newStatus === "connected") {
        // token should be in apiKeyInput
        const saved = await saveMetaToken(workspaceId, apiKeyInput);
        if (!saved) {
          toast.error("Erro ao salvar token Meta");
          return;
        }
      } else {
        // Disconnect: clear token
        await saveMetaToken(workspaceId, "");
      }
      ok = await saveMCPIntegration(workspaceId, provider, newStatus);
    } else {
      // Existing flow for other providers
      ok = await saveMCPIntegration(workspaceId, provider, newStatus, apiKeyInput);
    }
    if (ok) {
      toast.success(
        newStatus === "connected"
          ? `${provider.toUpperCase()} MCP conectado com sucesso!`
          : `${provider.toUpperCase()} MCP desconectado.`,
      );
      const updated = await getMCPIntegrations(workspaceId);
      setMcpList(updated);
      setSelectedMcp(null);
    } else {
      toast.error("Erro ao atualizar integração MCP");
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Configurações"
        description="Workspace, equipe, IA e servidores MCP da Meta e Google."
      />

      <Tabs defaultValue="mcp">
        <TabsList className="flex-wrap">
          <TabsTrigger value="mcp" className="gap-1.5">
            <Cpu className="size-3.5" /> IA & MCP (Meta/Google)
          </TabsTrigger>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="equipe">Equipe e papéis</TabsTrigger>
        </TabsList>

        <TabsContent value="mcp" className="space-y-4">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-primary" />
              <p className="text-sm font-semibold text-primary">
                Arquitetura Token Zero-Waste Ativa
              </p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              O Creative OS utiliza agregação prévia de dados no client e cache semântico no
              Supabase. Chamadas de métricas e ganchos idênticos não consomem tokens repetidos da
              sua cota.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {mcpList.map((mcp) => {
              const isConnected = mcp.status === "connected";
              return (
                <div key={mcp.provider} className="surface-panel flex flex-col justify-between p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {mcp.provider === "gemini" && <Bot className="size-4 text-purple-400" />}
                        {mcp.provider === "meta" && <Cpu className="size-4 text-blue-400" />}
                        {mcp.provider === "google" && <Cpu className="size-4 text-amber-400" />}
                        <p className="text-sm font-semibold">{mcp.name}</p>
                      </div>
                      <Tag tone={isConnected ? "success" : "muted"}>
                        {isConnected ? "Conectado" : "Desconectado"}
                      </Tag>
                    </div>
                    <p className="text-xs text-muted-foreground">{mcp.description}</p>
                    {mcp.lastSyncedAt && (
                      <p className="text-[10px] text-muted-foreground">
                        Último sync: {dateBR(mcp.lastSyncedAt)}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">
                      {isConnected ? "Pronto para orquestração" : "Requer chave de API"}
                    </span>
                    <Button
                      size="sm"
                      variant={isConnected ? "outline" : "default"}
                      onClick={() => {
                        if (isConnected) {
                          handleToggleMcp(mcp.provider, mcp.status);
                        } else {
                          setSelectedMcp(mcp);
                          setApiKeyInput("");
                        }
                      }}
                    >
                      {isConnected ? "Desconectar" : "Conectar MCP"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedMcp && (
            <div className="surface-panel mt-4 p-5 space-y-4 border-primary/30">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Key className="size-4 text-primary" /> Conectar {selectedMcp.name}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedMcp(null)}>
                  Cancelar
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Informe o token de acesso ou chave da API (será armazenada com segurança no seu
                workspace):
              </p>
              <div className="space-y-1.5">
                <Label htmlFor="mcp-key">Token / Chave de Acesso</Label>
                <Input
                  id="mcp-key"
                  type="password"
                  placeholder={
                    selectedMcp.provider === "meta"
                      ? "EAAG... (Meta Graph Token)"
                      : selectedMcp.provider === "gemini"
                        ? "AIzaSy... (Google Gemini Key)"
                        : "Token do Google Ads / OAuth"
                  }
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedMcp(null)}>
                  Voltar
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleToggleMcp(selectedMcp.provider, "disconnected")}
                >
                  Confirmar e Conectar
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="workspace">
          <section className="surface-panel space-y-3 p-4">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Workspace</p>
              <p className="mt-0.5 text-sm">{workspaceName ?? "—"}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Sua conta</p>
              <p className="mt-0.5 text-sm">{user?.email ?? "—"}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Seu papel</p>
              <p className="mt-0.5 text-sm">
                {ROLES.find((r) => r.value === role)?.label ?? role ?? "—"}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Todos os dados são isolados por workspace: ninguém de fora vê seus clientes, leads ou
              criativos.
            </p>
          </section>
        </TabsContent>

        <TabsContent value="equipe" className="space-y-4">
          <section className="surface-panel space-y-3 p-4">
            <h2 className="text-sm font-semibold">Convidar pessoa</h2>
            <div className="flex flex-wrap gap-2">
              <Label htmlFor="invite" className="sr-only">
                E-mail
              </Label>
              <Input
                id="invite"
                placeholder="email@empresa.com"
                value={invite}
                onChange={(e) => setInvite(e.target.value)}
                className="max-w-xs"
              />
              <Button
                variant="outline"
                onClick={() =>
                  toast.info(
                    "Envio de convite por e-mail ainda não está ligado. Peça para a pessoa criar conta e me avise para liberar o acesso.",
                  )
                }
              >
                Convidar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Papéis disponíveis: {ROLES.map((r) => r.label).join(", ")}.
            </p>
          </section>

          {(members.data ?? []).length === 0 ? (
            <EmptyState title="Nenhum membro listado" />
          ) : (
            <ul className="surface-panel divide-y divide-border">
              {(members.data ?? []).map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div>
                    <p className="text-sm">{m.user_id === user?.id ? user?.email : m.user_id}</p>
                    <p className="text-[11px] text-muted-foreground">
                      Desde {dateBR(m.created_at)}
                    </p>
                  </div>
                  <Tag tone={m.role === "admin" ? "primary" : "muted"}>
                    {ROLES.find((r) => r.value === m.role)?.label ?? m.role}
                  </Tag>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
