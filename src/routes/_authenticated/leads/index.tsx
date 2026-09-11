import { Link, createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState, LoadingRows, PageHeader, StatCard, Tag } from "@/components/ui-kit";
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
import { LEAD_SOURCES, PIPELINE_STAGES, leadTemperature } from "@/lib/crm";
import { useRows, useSaveRow } from "@/lib/data";
import { brl, dateBR } from "@/lib/domain";

export const Route = createFileRoute("/_authenticated/leads/")({
  head: () => ({
    meta: [
      { title: "Leads e Pipeline — Creative OS" },
      { name: "description", content: "Pipeline comercial com etapas, valor potencial, score e controle de contatos." },
      { property: "og:title", content: "Leads e Pipeline — Creative OS" },
      { property: "og:description", content: "Pipeline comercial do Creative OS." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LeadsPage,
});

type Lead = {
  id: string;
  name: string;
  company: string | null;
  stage: string;
  score: number | null;
  potential_value: number | null;
  contact_count: number | null;
  source: string | null;
  owner: string | null;
  next_contact_on: string | null;
  updated_at: string;
};

function LeadsPage() {
  const { workspaceId } = useAuth();
  const leads = useRows<Lead>("leads", workspaceId, { orderBy: "updated_at" });
  const save = useSaveRow("leads", { success: "Lead atualizado" });
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return (leads.data ?? []).filter(
      (l) => !t || `${l.name} ${l.company ?? ""} ${l.owner ?? ""}`.toLowerCase().includes(t),
    );
  }, [leads.data, q]);

  const open = filtered.filter((l) => !["FECHADO", "PERDIDO"].includes(l.stage));
  const potential = open.reduce((s, l) => s + Number(l.potential_value ?? 0), 0);
  const won = filtered.filter((l) => l.stage === "FECHADO");
  const hot = open.filter((l) => leadTemperature(l.score ?? 0).value === "HOT");

  return (
    <div className="space-y-5">
      <PageHeader
        title="Leads & Pipeline"
        description="Do primeiro contato ao fechamento, com etapas, follow-ups e motivos de perda."
        actions={<NewLeadDialog />}
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard label="Leads ativos" value={open.length} />
        <StatCard label="Receita potencial" value={brl(potential)} tone="neon" />
        <StatCard label="Leads quentes" value={hot.length} tone="destructive" />
        <StatCard label="Fechados" value={won.length} tone="primary" />
      </div>

      <Input
        placeholder="Buscar por nome, empresa ou responsável"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="max-w-md"
      />

      {leads.isLoading ? (
        <LoadingRows />
      ) : filtered.length === 0 ? (
        <EmptyState title="Nenhum lead ainda" description="Cadastre o primeiro lead para começar o pipeline." />
      ) : (
        <Tabs defaultValue="kanban">
          <TabsList>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="lista">Lista</TabsTrigger>
          </TabsList>

          <TabsContent value="kanban">
            <div className="flex gap-3 overflow-x-auto pb-3">
              {PIPELINE_STAGES.map((stage) => {
                const items = filtered.filter((l) => l.stage === stage.value);
                const value = items.reduce((s, l) => s + Number(l.potential_value ?? 0), 0);
                return (
                  <div key={stage.value} className="w-64 shrink-0">
                    <div className="surface-panel px-3 py-2">
                      <p className="text-xs font-semibold">{stage.label}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {items.length} lead(s) · {brl(value)}
                      </p>
                    </div>
                    <div
                      className="mt-2 min-h-24 space-y-2 rounded-lg border border-dashed border-border p-2"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        const leadId = e.dataTransfer.getData("text/plain");
                        if (leadId) save.mutate({ id: leadId, stage: stage.value });
                      }}
                    >
                      {items.map((l) => (
                        <Link
                          key={l.id}
                          to="/leads/$id"
                          params={{ id: l.id }}
                          draggable
                          onDragStart={(e) => e.dataTransfer.setData("text/plain", l.id)}
                          className="block rounded-md border border-border bg-card p-2.5 hover:border-primary/60"
                        >
                          <p className="text-sm font-medium">{l.name}</p>
                          <p className="text-[11px] text-muted-foreground">{l.company ?? "—"}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <Tag tone={leadTemperature(l.score ?? 0).tone}>
                              {leadTemperature(l.score ?? 0).label}
                            </Tag>
                            <span className="text-[11px] text-muted-foreground">
                              {brl(Number(l.potential_value ?? 0))}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="lista">
            <div className="surface-panel overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className="px-4 py-3">Lead</th>
                    <th className="px-4 py-3">Etapa</th>
                    <th className="px-4 py-3">Temperatura</th>
                    <th className="px-4 py-3">Valor</th>
                    <th className="px-4 py-3">Contatos</th>
                    <th className="px-4 py-3">Origem</th>
                    <th className="px-4 py-3">Próximo contato</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((l) => (
                    <tr key={l.id} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-3">
                        <Link to="/leads/$id" params={{ id: l.id }} className="hover:text-primary">
                          <span className="font-medium">{l.name}</span>
                          <span className="block text-xs text-muted-foreground">{l.company ?? "—"}</span>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {PIPELINE_STAGES.find((s) => s.value === l.stage)?.label ?? l.stage}
                      </td>
                      <td className="px-4 py-3">
                        <Tag tone={leadTemperature(l.score ?? 0).tone}>
                          {leadTemperature(l.score ?? 0).label}
                        </Tag>
                      </td>
                      <td className="px-4 py-3">{brl(Number(l.potential_value ?? 0))}</td>
                      <td className="px-4 py-3">{l.contact_count ?? 0} de 7</td>
                      <td className="px-4 py-3 text-xs">{l.source ?? "—"}</td>
                      <td className="px-4 py-3 text-xs">{dateBR(l.next_contact_on)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function NewLeadDialog() {
  const { workspaceId, user } = useAuth();
  const save = useSaveRow("leads", { success: "Lead criado" });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    contact_phone: "",
    contact_email: "",
    source: "INDICACAO",
    stage: "LEAD",
    potential_value: "",
    score: "50",
    pain: "",
  });

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    await save.mutateAsync({
      workspace_id: workspaceId,
      name: form.name.trim(),
      company: form.company || null,
      contact_phone: form.contact_phone || null,
      contact_email: form.contact_email || null,
      source: form.source,
      stage: form.stage,
      potential_value: form.potential_value ? Number(form.potential_value) : null,
      score: Number(form.score || 50),
      pain: form.pain || null,
      contact_count: 0,
      owner: user?.email ?? null,
    });
    setOpen(false);
    setForm({ ...form, name: "", company: "", contact_phone: "", contact_email: "", pain: "" });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1.5 size-4" /> Novo lead
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo lead</DialogTitle>
        </DialogHeader>
        <form className="space-y-3" onSubmit={submit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="l-name">Nome *</Label>
              <Input id="l-name" required value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="l-company">Empresa</Label>
              <Input id="l-company" value={form.company} onChange={(e) => set("company", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="l-phone">Telefone</Label>
              <Input id="l-phone" value={form.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="l-email">E-mail</Label>
              <Input id="l-email" type="email" value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Origem</Label>
              <Select value={form.source} onValueChange={(v) => set("source", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_SOURCES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Etapa</Label>
              <Select value={form.stage} onValueChange={(v) => set("stage", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PIPELINE_STAGES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="l-value">Valor potencial (R$)</Label>
              <Input
                id="l-value"
                type="number"
                value={form.potential_value}
                onChange={(e) => set("potential_value", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="l-score">Score (0-100)</Label>
              <Input
                id="l-score"
                type="number"
                min={0}
                max={100}
                value={form.score}
                onChange={(e) => set("score", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="l-pain">Dor / necessidade</Label>
            <Textarea id="l-pain" value={form.pain} onChange={(e) => set("pain", e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={save.isPending}>
              Criar lead
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
