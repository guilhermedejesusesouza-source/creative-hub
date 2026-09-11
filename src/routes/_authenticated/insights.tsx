import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";

import { EmptyState, LoadingRows, PageHeader, Tag } from "@/components/ui-kit";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useRows, useSaveRow } from "@/lib/data";
import { PRIORITIES, aggregateMetrics, dateBR, diagnose } from "@/lib/domain";

export const Route = createFileRoute("/_authenticated/insights")({
  head: () => ({
    meta: [
      { title: "Insights e Diagnósticos — Creative OS" },
      { name: "description", content: "Diagnósticos automáticos por cliente e biblioteca de insights com ação recomendada." },
      { property: "og:title", content: "Insights e Diagnósticos — Creative OS" },
      { property: "og:description", content: "Transforme dados em próximos testes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InsightsPage,
});

type Insight = {
  id: string;
  title: string;
  observation: string | null;
  evidence: string | null;
  hypothesis: string | null;
  action: string | null;
  priority: string | null;
  status: string | null;
  client_id: string | null;
  created_at: string;
};

function InsightsPage() {
  const { workspaceId } = useAuth();
  const insights = useRows<Insight>("insights", workspaceId, { orderBy: "created_at" });
  const clients = useRows<{ id: string; name: string }>("clients", workspaceId, {
    orderBy: "name",
    ascending: true,
  });
  const perf = useRows<Record<string, number | null> & { client_id: string | null }>(
    "performances",
    workspaceId,
  );
  const save = useSaveRow("insights", { success: "Insight atualizado" });

  const clientName = (id: string | null) => (clients.data ?? []).find((c) => c.id === id)?.name ?? "—";

  const perClient = (clients.data ?? []).map((c) => {
    const rows = (perf.data ?? []).filter((p) => p.client_id === c.id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const m = aggregateMetrics(rows as any);
    return { client: c, diags: diagnose(m) };
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Insights & Diagnósticos"
        description="Leituras prováveis dos dados e o que testar em seguida."
        actions={<NewInsightDialog clients={clients.data ?? []} />}
      />

      <Tabs defaultValue="diagnosticos">
        <TabsList>
          <TabsTrigger value="diagnosticos">Diagnósticos</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="diagnosticos" className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Baseado nos números registrados. São indícios para investigação, não causas comprovadas.
          </p>
          {perClient.every((p) => p.diags.length === 0) ? (
            <EmptyState title="Sem dados suficientes" description="Registre performance para gerar diagnósticos." />
          ) : (
            perClient
              .filter((p) => p.diags.length > 0)
              .map(({ client, diags }) => (
                <section key={client.id} className="surface-panel p-4">
                  <h2 className="text-sm font-semibold">{client.name}</h2>
                  <ul className="mt-3 space-y-3">
                    {diags.map((d) => (
                      <li key={d.title} className="rounded-md border border-border p-3">
                        <p className="text-sm font-medium">{d.title}</p>
                        <p className="text-sm text-muted-foreground">{d.explanation}</p>
                        <p className="mt-1 text-sm text-primary">{d.action}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              ))
          )}
        </TabsContent>

        <TabsContent value="insights">
          {insights.isLoading ? (
            <LoadingRows />
          ) : (insights.data ?? []).length === 0 ? (
            <EmptyState title="Nenhum insight registrado" description="Crie o primeiro insight a partir dos dados." />
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {(insights.data ?? []).map((i) => (
                <li key={i.id} className="surface-panel p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold">{i.title}</p>
                    <Tag tone={i.priority === "urgente" ? "destructive" : "muted"}>{i.priority ?? "—"}</Tag>
                  </div>
                  <p className="text-xs text-muted-foreground">{clientName(i.client_id)}</p>
                  <dl className="mt-3 space-y-2 text-sm">
                    {[
                      ["Observação", i.observation],
                      ["Evidência", i.evidence],
                      ["Hipótese", i.hypothesis],
                      ["Ação recomendada", i.action],
                    ].map(([k, v]) => (
                      <div key={String(k)}>
                        <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{k}</dt>
                        <dd className="mt-0.5">{v ?? "—"}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">{dateBR(i.created_at)}</span>
                    <Select
                      value={i.status ?? "ABERTO"}
                      onValueChange={(v) => save.mutate({ id: i.id, status: v })}
                    >
                      <SelectTrigger className="h-8 w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["ABERTO", "EM_TESTE", "VALIDADO", "DESCARTADO"].map((s) => (
                          <SelectItem key={s} value={s}>
                            {s.replace("_", " ").toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NewInsightDialog({ clients }: { clients: { id: string; name: string }[] }) {
  const { workspaceId, user } = useAuth();
  const save = useSaveRow("insights", { success: "Insight criado" });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    client_id: "",
    observation: "",
    evidence: "",
    hypothesis: "",
    action: "",
    priority: "media",
  });

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    await save.mutateAsync({
      workspace_id: workspaceId,
      title: form.title.trim(),
      client_id: form.client_id || null,
      observation: form.observation || null,
      evidence: form.evidence || null,
      hypothesis: form.hypothesis || null,
      action: form.action || null,
      priority: form.priority,
      status: "ABERTO",
      author: user?.email ?? null,
    });
    setOpen(false);
    setForm({ ...form, title: "", observation: "", evidence: "", hypothesis: "", action: "" });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1.5 size-4" /> Novo insight
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo insight</DialogTitle>
        </DialogHeader>
        <form className="space-y-3" onSubmit={submit}>
          <div className="space-y-1.5">
            <Label htmlFor="i-title">Título *</Label>
            <Input id="i-title" required value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Cliente</Label>
              <Select value={form.client_id} onValueChange={(v) => set("client_id", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Opcional" />
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
              <Label>Prioridade</Label>
              <Select value={form.priority} onValueChange={(v) => set("priority", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {(
            [
              ["observation", "Observação"],
              ["evidence", "Evidência"],
              ["hypothesis", "Hipótese"],
              ["action", "Ação recomendada"],
            ] as [keyof typeof form, string][]
          ).map(([k, label]) => (
            <div key={k} className="space-y-1.5">
              <Label htmlFor={`i-${k}`}>{label}</Label>
              <Textarea id={`i-${k}`} value={form[k]} onChange={(e) => set(k, e.target.value)} />
            </div>
          ))}
          <DialogFooter>
            <Button type="submit" disabled={save.isPending}>
              Criar insight
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
