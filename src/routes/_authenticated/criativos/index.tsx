import { Link, createFileRoute } from "@tanstack/react-router";
import { Plus, Sparkles, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DemoTag, EmptyState, LoadingRows, PageHeader, Tag } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useRows, useSaveRow } from "@/lib/data";
import {
  AWARENESS_LEVELS,
  CREATIVE_STATUSES,
  FORMATS,
  FUNNEL_STAGES,
  PLATFORMS,
  PRIORITIES,
  STATUS_LABELS,
  dateBR,
  type CreativeStatus,
} from "@/lib/domain";
import { generateCreativeHooks } from "@/lib/ai/gemini-service";
import type { GeneratedHook } from "@/lib/ai/types";

export const Route = createFileRoute("/_authenticated/criativos/")({
  head: () => ({
    meta: [
      { title: "Criativos — Creative OS" },
      { name: "description", content: "Todos os criativos com status, plataforma, formato, responsável e score." },
      { property: "og:title", content: "Criativos — Creative OS" },
      { property: "og:description", content: "Gerencie criativos de ponta a ponta." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CreativesPage,
});

type Creative = {
  id: string;
  code: string | null;
  name: string;
  status: string;
  platform: string | null;
  format: string | null;
  owner: string | null;
  priority: string | null;
  due_on: string | null;
  client_id: string | null;
  is_demo: boolean | null;
};

function CreativesPage() {
  const { workspaceId } = useAuth();
  const creatives = useRows<Creative>("creatives", workspaceId, { orderBy: "created_at" });
  const clients = useRows<{ id: string; name: string }>("clients", workspaceId, {
    orderBy: "name",
    ascending: true,
  });
  const projects = useRows<{ id: string; name: string; client_id: string }>("projects", workspaceId);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("TODOS");
  const [client, setClient] = useState("TODOS");

  const clientName = (id: string | null) => (clients.data ?? []).find((c) => c.id === id)?.name ?? "—";

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return (creatives.data ?? []).filter(
      (c) =>
        (!t || `${c.name} ${c.code ?? ""}`.toLowerCase().includes(t)) &&
        (status === "TODOS" || c.status === status) &&
        (client === "TODOS" || c.client_id === client),
    );
  }, [creatives.data, q, status, client]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Criativos"
        description="Cada criativo com ID sequencial, estratégia, produção e resultados."
        actions={
          <div className="flex items-center gap-2">
            <AICreativeGeneratorDialog clients={clients.data ?? []} projects={projects.data ?? []} />
            <NewCreativeDialog clients={clients.data ?? []} projects={projects.data ?? []} />
          </div>
        }
      />

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Buscar por nome ou código"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos os status</SelectItem>
            {CREATIVE_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={client} onValueChange={setClient}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos os clientes</SelectItem>
            {(clients.data ?? []).map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {creatives.isLoading ? (
        <LoadingRows />
      ) : list.length === 0 ? (
        <EmptyState title="Nenhum criativo encontrado" description="Ajuste os filtros ou crie um novo criativo." />
      ) : (
        <div className="surface-panel overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-4 py-3">Criativo</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Plataforma</th>
                <th className="px-4 py-3">Formato</th>
                <th className="px-4 py-3">Responsável</th>
                <th className="px-4 py-3">Prazo</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3">
                    <Link to="/criativos/$id" params={{ id: c.id }} className="hover:text-primary">
                      <span className="text-muted-foreground">{c.code} </span>
                      <span className="font-medium">{c.name}</span>
                    </Link>
                    {c.is_demo ? <DemoTag /> : null}
                  </td>
                  <td className="px-4 py-3">{clientName(c.client_id)}</td>
                  <td className="px-4 py-3">
                    <Tag>{STATUS_LABELS[c.status as CreativeStatus] ?? c.status}</Tag>
                  </td>
                  <td className="px-4 py-3">{c.platform ?? "—"}</td>
                  <td className="px-4 py-3">{c.format ?? "—"}</td>
                  <td className="px-4 py-3">{c.owner ?? "—"}</td>
                  <td className="px-4 py-3">{dateBR(c.due_on)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function NewCreativeDialog({
  clients,
  projects,
}: {
  clients: { id: string; name: string }[];
  projects: { id: string; name: string; client_id: string }[];
}) {
  const { workspaceId, user } = useAuth();
  const save = useSaveRow("creatives", { success: "Criativo criado" });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    client_id: "",
    project_id: "",
    platform: "Meta",
    format: "Reels",
    funnel: "TOFU",
    awareness: "problem_aware",
    priority: "media",
    hypothesis: "",
    concept: "",
  });

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.client_id) return;
    await save.mutateAsync({
      workspace_id: workspaceId,
      name: form.name.trim(),
      client_id: form.client_id,
      project_id: form.project_id || null,
      platform: form.platform,
      format: form.format,
      funnel: form.funnel,
      awareness: form.awareness,
      priority: form.priority,
      hypothesis: form.hypothesis || null,
      concept_big_idea: form.concept || null,
      status: "BACKLOG",
      owner: user?.email ?? null,
    });
    setOpen(false);
    setForm({ ...form, name: "", hypothesis: "", concept: "" });
  }

  const projectOptions = projects.filter((p) => !form.client_id || p.client_id === form.client_id);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1.5 size-4" /> Novo criativo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Novo criativo</DialogTitle>
        </DialogHeader>
        <form className="space-y-3" onSubmit={submit}>
          <div className="space-y-1.5">
            <Label htmlFor="c-name">Nome *</Label>
            <Input id="c-name" required value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Cliente *</Label>
              <Select value={form.client_id} onValueChange={(v) => set("client_id", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Projeto</Label>
              <Select value={form.project_id} onValueChange={(v) => set("project_id", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Opcional" />
                </SelectTrigger>
                <SelectContent>
                  {projectOptions.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <SelectField label="Plataforma" value={form.platform} onChange={(v) => set("platform", v)} options={PLATFORMS.map((p) => ({ value: p, label: p }))} />
            <SelectField label="Formato" value={form.format} onChange={(v) => set("format", v)} options={FORMATS.map((f) => ({ value: f, label: f }))} />
            <SelectField label="Funil" value={form.funnel} onChange={(v) => set("funnel", v)} options={FUNNEL_STAGES} />
            <SelectField
              label="Nível de consciência"
              value={form.awareness}
              onChange={(v) => set("awareness", v)}
              options={AWARENESS_LEVELS}
            />
            <SelectField label="Prioridade" value={form.priority} onChange={(v) => set("priority", v)} options={PRIORITIES} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-hyp">Hipótese</Label>
            <Textarea
              id="c-hyp"
              placeholder="Se [mudança], então [resultado esperado], porque [mecanismo/insight]."
              value={form.hypothesis}
              onChange={(e) => set("hypothesis", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-concept">Big idea</Label>
            <Textarea id="c-concept" value={form.concept} onChange={(e) => set("concept", e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={save.isPending}>
              Criar criativo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function AICreativeGeneratorDialog({
  clients,
  projects,
}: {
  clients: { id: string; name: string }[];
  projects: { id: string; name: string; client_id: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [clientId, setClientId] = useState("");
  const [productName, setProductName] = useState("");
  const [promise, setPromise] = useState("");
  const [category, setCategory] = useState<any>("dor");
  const [busy, setBusy] = useState(false);
  const [generatedHooks, setGeneratedHooks] = useState<GeneratedHook[]>([]);
  const [isCached, setIsCached] = useState(false);
  const { workspaceId } = useAuth();
  const saveCreative = useSaveRow("creatives", { success: "Criativo gerado e salvo com sucesso!" });

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!workspaceId) return;
    setBusy(true);
    const clientObj = clients.find((c) => c.id === clientId);
    try {
      const res = await generateCreativeHooks({
        workspaceId,
        clientName: clientObj?.name || "Cliente",
        productName: productName || "Produto Principal",
        offerPromise: promise,
        category,
        count: 4,
      });
      setGeneratedHooks(res.hooks);
      setIsCached(res.cached);
      toast.success(
        res.cached
          ? "Ganchos recuperados do cache instantâneo (0 tokens consumidos!)"
          : "Novos ganchos gerados pela IA com sucesso!"
      );
    } catch {
      toast.error("Erro ao gerar ganchos com IA");
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveAsCreative(hook: GeneratedHook) {
    if (!workspaceId) return;
    const clientProjects = projects.filter((p) => p.client_id === clientId);
    await saveCreative.mutateAsync({
      workspace_id: workspaceId,
      client_id: clientId || null,
      project_id: clientProjects[0]?.id || null,
      name: `[IA] ${hook.text.slice(0, 40)}...`,
      platform: "Meta",
      format: hook.format === "video_9_16" ? "Vídeo 9:16" : hook.format === "carrossel" ? "Carrossel 4:5" : "Reels",
      status: "BACKLOG",
      hypothesis: `Hook focado em ${hook.category}: "${hook.text}" - ${hook.rationale}`,
      concept: hook.text,
      funnel: "TOFU",
      priority: "alta",
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-primary/40 bg-primary/5 hover:bg-primary/10">
          <Sparkles className="size-4 text-primary" /> Gerar com IA
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" /> Gerador Inteligente de Ganchos & Criativos
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Cliente</Label>
              <Select value={clientId} onValueChange={setClientId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Ângulo / Categoria</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dor">Dor / Frustração</SelectItem>
                  <SelectItem value="curiosidade">Curiosidade</SelectItem>
                  <SelectItem value="prova">Prova Social</SelectItem>
                  <SelectItem value="quebra_de_padrao">Quebra de Padrão</SelectItem>
                  <SelectItem value="urgencia">Urgência / Escassez</SelectItem>
                  <SelectItem value="beneficio">Benefício Direto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="ai-prod">Produto / Serviço</Label>
              <Input
                id="ai-prod"
                placeholder="Ex: Harmonização Facial, Curso Tráfego"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ai-prom">Promessa da Oferta (Opcional)</Label>
              <Input
                id="ai-prom"
                placeholder="Ex: Agende avaliação e saiba o protocolo ideal"
                value={promise}
                onChange={(e) => setPromise(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Zap className="size-3.5 text-primary" /> Gemini Flash + Token Cache Ativo
            </span>
            <Button type="submit" disabled={busy || !clientId || !productName}>
              {busy ? "Criando ganchos..." : "Gerar 4 Opções"}
            </Button>
          </div>
        </form>

        {generatedHooks.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Opções de Ganchos Geradas:</h4>
              {isCached && (
                <Tag tone="info">⚡ Resposta do Cache (0 Tokens)</Tag>
              )}
            </div>

            <div className="grid gap-2">
              {generatedHooks.map((h, idx) => (
                <div key={idx} className="surface-panel p-3 flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">"{h.text}"</p>
                    <p className="text-xs text-muted-foreground">{h.rationale}</p>
                    <Tag tone="muted">{h.category}</Tag>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                    onClick={() => handleSaveAsCreative(h)}
                  >
                    Salvar Criativo
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
