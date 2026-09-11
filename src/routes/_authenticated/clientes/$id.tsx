import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Pin } from "lucide-react";
import { useState } from "react";

import { EmptyState, LoadingRows, PageHeader, StatCard, Tag } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
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
import {
  CLIENT_STATUSES,
  HEALTH_STATUSES,
  NOTE_CATEGORIES,
  TASK_STATUSES,
  isOverdue,
  labelFrom,
  toneFrom,
} from "@/lib/crm";
import { useRow, useRows, useSaveRow } from "@/lib/data";
import {
  STATUS_LABELS,
  aggregateMetrics,
  brl,
  dateBR,
  dateTimeBR,
  dec,
  num,
  pct,
  type CreativeStatus,
} from "@/lib/domain";

export const Route = createFileRoute("/_authenticated/clientes/$id")({
  head: () => ({
    meta: [
      { title: "Cliente — Creative OS" },
      { name: "description", content: "Visão 360 do cliente: relacionamento, tarefas, projetos, criativos e resultados." },
      { property: "og:title", content: "Cliente — Creative OS" },
      { property: "og:description", content: "Visão 360 do cliente." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClientDetail,
  errorComponent: () => <EmptyState title="Não foi possível carregar este cliente" />,
  notFoundComponent: () => <EmptyState title="Cliente não encontrado" />,
});

type Client = Record<string, string | number | boolean | null | string[]> & {
  id: string;
  name: string;
  status: string;
  health: string;
};

function ClientDetail() {
  const { id } = Route.useParams();
  const { workspaceId } = useAuth();
  const client = useRow<Client>("clients", id);
  const save = useSaveRow("clients", { success: "Cliente atualizado" });

  const activities = useRows<{
    id: string;
    title: string;
    type: string;
    body: string | null;
    happened_at: string;
    author: string | null;
  }>("crm_activities", workspaceId, { eq: { client_id: id }, orderBy: "happened_at" });
  const tasks = useRows<{ id: string; title: string; status: string; due_on: string | null }>(
    "tasks",
    workspaceId,
    { eq: { client_id: id }, orderBy: "due_on", ascending: true },
  );
  const projects = useRows<{ id: string; name: string; status: string; objective: string | null }>(
    "projects",
    workspaceId,
    { eq: { client_id: id } },
  );
  const creatives = useRows<{ id: string; name: string; code: string | null; status: string }>(
    "creatives",
    workspaceId,
    { eq: { client_id: id } },
  );
  const perf = useRows<Record<string, number | null>>("performances", workspaceId, {
    eq: { client_id: id },
  });
  const notes = useRows<{
    id: string;
    title: string;
    body: string | null;
    category: string;
    priority: string;
    is_pinned: boolean;
    created_at: string;
  }>("client_notes", workspaceId, { eq: { client_id: id }, orderBy: "created_at" });

  if (client.isLoading) return <LoadingRows rows={6} />;
  const c = client.data;
  if (!c) return <EmptyState title="Cliente não encontrado" />;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metrics = aggregateMetrics((perf.data ?? []) as any);
  const openTasks = (tasks.data ?? []).filter((t) => t.status !== "CONCLUIDA");
  const sortedNotes = [...(notes.data ?? [])].sort(
    (a, b) => Number(b.is_pinned) - Number(a.is_pinned),
  );

  const healthSignals = [
    openTasks.filter((t) => isOverdue(t.due_on)).length > 0
      ? "Existem tarefas atrasadas deste cliente."
      : null,
    metrics.spend > 0 && metrics.roas < 1 ? "ROAS abaixo de 1 no período registrado." : null,
    (creatives.data ?? []).length === 0 ? "Nenhum criativo cadastrado ainda." : null,
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-5">
      <Link to="/clientes" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Voltar para clientes
      </Link>

      <PageHeader
        title={c.name}
        description={[c["company"], c["segment"], c["service"]].filter(Boolean).join(" · ") || " "}
        actions={
          <div className="flex gap-2">
            <Select
              value={c.status}
              onValueChange={(v) => save.mutate({ id, status: v })}
            >
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CLIENT_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={c.health} onValueChange={(v) => save.mutate({ id, health: v })}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HEALTH_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Valor mensal" value={brl(Number(c["monthly_value"] ?? 0))} />
        <StatCard label="Tarefas abertas" value={openTasks.length} />
        <StatCard label="Criativos" value={(creatives.data ?? []).length} />
        <StatCard label="ROAS" value={dec(metrics.roas)} tone="neon" />
      </div>

      <Tabs defaultValue="visao">
        <TabsList className="flex-wrap">
          <TabsTrigger value="visao">Visão geral</TabsTrigger>
          <TabsTrigger value="atividades">Atividades</TabsTrigger>
          <TabsTrigger value="tarefas">Tarefas</TabsTrigger>
          <TabsTrigger value="projetos">Projetos</TabsTrigger>
          <TabsTrigger value="criativos">Criativos</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="observacoes">Observações</TabsTrigger>
        </TabsList>

        <TabsContent value="visao" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <section className="surface-panel p-4">
              <h2 className="text-sm font-semibold">Dados comerciais e contato</h2>
              <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <Info label="Status" value={labelFrom(CLIENT_STATUSES, c.status)} />
                <Info label="Prioridade" value={String(c["priority"] ?? "—")} />
                <Info label="Responsável" value={String(c["account_manager"] ?? "—")} />
                <Info label="Comercial" value={String(c["sales_owner"] ?? "—")} />
                <Info label="Contato" value={String(c["contact_name"] ?? "—")} />
                <Info label="Telefone" value={String(c["contact_phone"] ?? "—")} />
                <Info label="E-mail" value={String(c["contact_email"] ?? "—")} />
                <Info label="WhatsApp" value={String(c["whatsapp"] ?? "—")} />
                <Info label="Instagram" value={String(c["instagram"] ?? "—")} />
                <Info label="Site" value={String(c["website"] ?? "—")} />
                <Info label="Cidade/UF" value={[c["city"], c["state"]].filter(Boolean).join("/") || "—"} />
                <Info label="Entrada" value={dateBR(String(c["entry_date"] ?? "")) || "—"} />
                <Info label="Vencimento" value={c["due_day"] ? `Dia ${c["due_day"]}` : "—"} />
                <Info label="Financeiro" value={String(c["financial_status"] ?? "—")} />
              </dl>
            </section>

            <section className="surface-panel p-4">
              <h2 className="text-sm font-semibold">Saúde do cliente</h2>
              <div className="mt-3">
                <Tag tone={toneFrom(HEALTH_STATUSES, c.health)}>
                  {labelFrom(HEALTH_STATUSES, c.health)}
                </Tag>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Sinais observados nos dados (indícios, não causas comprovadas):
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                {healthSignals.length === 0 ? (
                  <li>Nenhum sinal de risco encontrado nos registros atuais.</li>
                ) : (
                  healthSignals.map((s) => <li key={s}>• {s}</li>)
                )}
              </ul>
              {c["notes"] ? (
                <>
                  <h3 className="mt-5 text-sm font-semibold">Observações gerais</h3>
                  <p className="mt-1.5 whitespace-pre-wrap text-sm text-muted-foreground">
                    {String(c["notes"])}
                  </p>
                </>
              ) : null}
            </section>
          </div>
        </TabsContent>

        <TabsContent value="atividades" className="space-y-4">
          <ActivityForm clientId={id} />
          {(activities.data ?? []).length === 0 ? (
            <EmptyState title="Sem atividades" description="Registre contatos, reuniões e decisões." />
          ) : (
            <ol className="surface-panel divide-y divide-border">
              {[...(activities.data ?? [])].reverse().map((a) => (
                <li key={a.id} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{a.title}</p>
                    <Tag>{a.type}</Tag>
                  </div>
                  {a.body ? <p className="mt-1 text-sm text-muted-foreground">{a.body}</p> : null}
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {dateTimeBR(a.happened_at)} {a.author ? `· ${a.author}` : ""}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </TabsContent>

        <TabsContent value="tarefas">
          {(tasks.data ?? []).length === 0 ? (
            <EmptyState title="Sem tarefas" description="Crie tarefas na página Tarefas e vincule a este cliente." />
          ) : (
            <ul className="surface-panel divide-y divide-border">
              {(tasks.data ?? []).map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="text-sm">{t.title}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{dateBR(t.due_on)}</span>
                    <Tag tone={toneFrom(TASK_STATUSES, t.status)}>
                      {labelFrom(TASK_STATUSES, t.status)}
                    </Tag>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="projetos">
          {(projects.data ?? []).length === 0 ? (
            <EmptyState title="Sem projetos" />
          ) : (
            <ul className="surface-panel divide-y divide-border">
              {(projects.data ?? []).map((p) => (
                <li key={p.id} className="px-4 py-3">
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.objective ?? "—"}</p>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="criativos">
          {(creatives.data ?? []).length === 0 ? (
            <EmptyState title="Sem criativos" />
          ) : (
            <ul className="surface-panel divide-y divide-border">
              {(creatives.data ?? []).map((cr) => (
                <li key={cr.id} className="flex items-center justify-between px-4 py-3">
                  <Link to="/criativos/$id" params={{ id: cr.id }} className="text-sm hover:text-primary">
                    <span className="text-muted-foreground">{cr.code} </span>
                    {cr.name}
                  </Link>
                  <Tag>{STATUS_LABELS[cr.status as CreativeStatus] ?? cr.status}</Tag>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Investimento" value={brl(metrics.spend)} />
            <StatCard label="Impressões" value={num(metrics.impressions)} />
            <StatCard label="CTR" value={pct(metrics.ctr)} />
            <StatCard label="CPC" value={brl(metrics.cpc)} />
            <StatCard label="Leads" value={num(metrics.leads)} />
            <StatCard label="CPL" value={brl(metrics.cpl)} />
            <StatCard label="Receita" value={brl(metrics.revenue)} />
            <StatCard label="ROAS" value={dec(metrics.roas)} tone="neon" />
          </div>
        </TabsContent>

        <TabsContent value="observacoes" className="space-y-4">
          <NoteForm clientId={id} />
          {sortedNotes.length === 0 ? (
            <EmptyState title="Sem observações" />
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {sortedNotes.map((n) => (
                <li key={n.id} className="surface-panel p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{n.title}</p>
                    {n.is_pinned ? <Pin className="size-3.5 text-primary" /> : null}
                  </div>
                  {n.body ? (
                    <p className="mt-1.5 whitespace-pre-wrap text-sm text-muted-foreground">{n.body}</p>
                  ) : null}
                  <div className="mt-3 flex items-center gap-2">
                    <Tag>{labelFrom(NOTE_CATEGORIES, n.category)}</Tag>
                    <span className="text-[11px] text-muted-foreground">{dateBR(n.created_at)}</span>
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 truncate">{value}</dd>
    </div>
  );
}

function ActivityForm({ clientId }: { clientId: string }) {
  const { workspaceId, user } = useAuth();
  const save = useSaveRow("crm_activities", { success: "Atividade registrada" });
  const [title, setTitle] = useState("");
  const [type, setType] = useState("CONTATO");
  const [body, setBody] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await save.mutateAsync({
      workspace_id: workspaceId,
      client_id: clientId,
      title: title.trim(),
      type,
      body: body || null,
      author: user?.email ?? null,
      happened_at: new Date().toISOString(),
    });
    setTitle("");
    setBody("");
  }

  return (
    <form className="surface-panel space-y-3 p-4" onSubmit={submit}>
      <h2 className="text-sm font-semibold">Registrar atividade</h2>
      <div className="grid gap-3 sm:grid-cols-[1fr_12rem]">
        <div className="space-y-1.5">
          <Label htmlFor="a-title">O que aconteceu</Label>
          <Input id="a-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label>Tipo</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["CONTATO", "REUNIAO", "PROPOSTA", "ENTREGA", "SUPORTE", "OUTRO"].map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Textarea
        placeholder="Detalhes, decisões e próximos passos"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <Button type="submit" size="sm" disabled={save.isPending}>
        Registrar
      </Button>
    </form>
  );
}

function NoteForm({ clientId }: { clientId: string }) {
  const { workspaceId, user } = useAuth();
  const save = useSaveRow("client_notes", { success: "Observação salva" });
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("GERAL");
  const [pinned, setPinned] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await save.mutateAsync({
      workspace_id: workspaceId,
      client_id: clientId,
      title: title.trim(),
      body: body || null,
      category,
      priority: "MEDIA",
      is_pinned: pinned,
      author: user?.email ?? null,
    });
    setTitle("");
    setBody("");
    setPinned(false);
  }

  return (
    <form className="surface-panel space-y-3 p-4" onSubmit={submit}>
      <h2 className="text-sm font-semibold">Nova observação</h2>
      <div className="grid gap-3 sm:grid-cols-[1fr_12rem]">
        <div className="space-y-1.5">
          <Label htmlFor="n-title">Título</Label>
          <Input id="n-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label>Categoria</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {NOTE_CATEGORIES.map((n) => (
                <SelectItem key={n.value} value={n.value}>
                  {n.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Conteúdo" />
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" disabled={save.isPending}>
          Salvar observação
        </Button>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={pinned}
            onChange={(e) => setPinned(e.target.checked)}
            className="size-4 accent-[var(--primary)]"
          />
          Fixar no topo
        </label>
      </div>
    </form>
  );
}
