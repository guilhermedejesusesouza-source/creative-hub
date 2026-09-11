import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyState, PageHeader, Tag } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { integrations } from "@/lib/integrations";
import { useRows } from "@/lib/data";
import { ROLES, dateBR } from "@/lib/domain";

export const Route = createFileRoute("/_authenticated/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — Creative OS" },
      { name: "description", content: "Workspace, equipe, papéis e integrações preparadas do Creative OS." },
      { property: "og:title", content: "Configurações — Creative OS" },
      { property: "og:description", content: "Ajuste workspace, equipe e integrações." },
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

  return (
    <div className="space-y-5">
      <PageHeader title="Configurações" description="Workspace, equipe, papéis e integrações." />

      <Tabs defaultValue="workspace">
        <TabsList className="flex-wrap">
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="equipe">Equipe e papéis</TabsTrigger>
          <TabsTrigger value="integracoes">Integrações</TabsTrigger>
        </TabsList>

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
              Todos os dados são isolados por workspace: ninguém de fora vê seus clientes, leads ou criativos.
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
                    <p className="text-[11px] text-muted-foreground">Desde {dateBR(m.created_at)}</p>
                  </div>
                  <Tag tone={m.role === "admin" ? "primary" : "muted"}>
                    {ROLES.find((r) => r.value === m.role)?.label ?? m.role}
                  </Tag>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="integracoes" className="space-y-4">
          <p className="text-xs text-muted-foreground">
            As integrações abaixo já têm o encaixe pronto no sistema, mas nenhuma está conectada — nada aqui exibe
            dados externos reais.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {integrations.map((i) => (
              <li key={i.id} className="surface-panel p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold">{i.name}</p>
                  <Tag tone={i.connected ? "success" : "muted"}>
                    {i.connected ? "Conectado" : "Não conectado"}
                  </Tag>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{i.description}</p>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
}
