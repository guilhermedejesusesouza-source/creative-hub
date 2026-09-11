import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { EmptyState, LoadingRows, PageHeader, StatCard, Tag } from "@/components/ui-kit";
import { useAuth } from "@/hooks/useAuth";
import { CLIENT_STATUSES, isOverdue, isToday, labelFrom, toneFrom } from "@/lib/crm";
import { useRows } from "@/lib/data";
import {
  STATUS_LABELS,
  aggregateMetrics,
  brl,
  dateBR,
  dec,
  diagnose,
  num,
  pct,
  type CreativeStatus,
} from "@/lib/domain";

const DIAG_TONE: Record<string, string> = {
  positivo: "success",
  atencao: "warning",
  critico: "destructive",
  oportunidade: "info",
};

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Creative OS" },
      {
        name: "description",
        content: "Visão executiva e operacional: tarefas, follow-ups, produção criativa e performance.",
      },
      { property: "og:title", content: "Dashboard — Creative OS" },
      { property: "og:description", content: "Central de comando da operação." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

type Task = {
  id: string;
  title: string;
  status: string;
  due_on: string | null;
  priority: string;
  client_id: string | null;
};
type FollowUp = { id: string; number: number; due_on: string; status: string; lead_id: string | null };
type Creative = { id: string; name: string; code: string | null; status: string; client_id: string | null };
type Client = { id: string; name: string; status: string; health: string; monthly_value: number | null };
type Lead = { id: string; name: string; stage: string; score: number; potential_value: number | null };
type Perf = {
  id: string;
  creative_id: string | null;
  period_start: string | null;
  spend: number | null;
  impressions: number | null;
  reach: number | null;
  clicks: number | null;
  lpv: number | null;
  conversions: number | null;
  leads: number | null;
  purchases: number | null;
  revenue: number | null;
};

function Dashboard() {
  const { workspaceId } = useAuth();
  const tasks = useRows<Task>("tasks", workspaceId, { orderBy: "due_on", ascending: true });
  const follows = useRows<FollowUp>("follow_ups", workspaceId, { orderBy: "due_on", ascending: true });
  const creatives = useRows<Creative>("creatives", workspaceId);
  const clients = useRows<Client>("clients", workspaceId, { orderBy: "name", ascending: true });
  const leads = useRows<Lead>("leads", workspaceId);
  const perf = useRows<Perf>("performances", workspaceId, { orderBy: "period_start", ascending: true });

  const loading =
    tasks.isLoading || creatives.isLoading || clients.isLoading || leads.isLoading || perf.isLoading;

  if (loading) return <LoadingRows rows={8} />;

  const openTasks = (tasks.data ?? []).filter((t) => t.status !== "CONCLUIDA" && t.status !== "CANCELADA");
  const todayTasks = openTasks.filter((t) => isToday(t.due_on));
  const lateTasks = openTasks.filter((t) => isOverdue(t.due_on));
  const openFollows = (follows.data ?? []).filter(
    (f) => f.status !== "CONCLUIDO" && f.status !== "CANCELADO",
  );
  const lateFollows = openFollows.filter((f) => isOverdue(f.due_on));

  const cs = creatives.data ?? [];
  const inProduction = cs.filter((c) =>
    ["BRIEFING", "ESTRATEGIA", "COPY", "DIRECAO", "PRODUCAO", "REVISAO"].includes(c.status),
  ).length;
  const waitingApproval = cs.filter((c) => c.status === "APROVACAO").length;
  const published = cs.filter((c) => c.status === "PUBLICADO").length;

  const metrics = aggregateMetrics(perf.data ?? []);
  const diagnoses = diagnose(metrics);

  const byStatus = Object.entries(
    cs.reduce<Record<string, number>>((acc, c) => {
      acc[c.status] = (acc[c.status] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([status, total]) => ({
    status: STATUS_LABELS[status as CreativeStatus] ?? status,
    total,
  }));

  const timeline = Object.entries(
    (perf.data ?? []).reduce<Record<string, { spend: number; revenue: number }>>((acc, p) => {
      const k = (p.period_start ?? "").slice(0, 10);
      if (!k) return acc;
      const cur = acc[k] ?? { spend: 0, revenue: 0 };
      acc[k] = { spend: cur.spend + (p.spend ?? 0), revenue: cur.revenue + (p.revenue ?? 0) };
      return acc;
    }, {}),
  )
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({ date: dateBR(date), ...v }));

  const perfByCreative = new Map<string, Perf[]>();
  for (const p of perf.data ?? []) {
    if (!p.creative_id) continue;
    perfByCreative.set(p.creative_id, [...(perfByCreative.get(p.creative_id) ?? []), p]);
  }
  const ranking = cs
    .map((c) => ({ creative: c, m: aggregateMetrics(perfByCreative.get(c.id) ?? []) }))
    .filter((r) => r.m.spend > 0)
    .sort((a, b) => b.m.roas - a.m.roas)
    .slice(0, 5);

  const attention = (clients.data ?? []).filter((c) => c.health !== "SAUDAVEL");
  const hotLeads = (leads.data ?? []).filter((l) => l.score >= 70 && l.stage !== "PERDIDO");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Sua central de comando: o que vence hoje, o que está atrasado e o que está performando."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tarefas hoje" value={todayTasks.length} hint={`${openTasks.length} abertas`} />
        <StatCard
          label="Tarefas atrasadas"
          value={lateTasks.length}
          tone={lateTasks.length ? "destructive" : "muted"}
        />
        <StatCard
          label="Follow-ups atrasados"
          value={lateFollows.length}
          hint={`${openFollows.length} pendentes`}
          tone={lateFollows.length ? "destructive" : "muted"}
        />
        <StatCard label="Leads quentes" value={hotLeads.length} tone="neon" />
        <StatCard label="Em produção" value={inProduction} />
        <StatCard label="Aguardando aprovação" value={waitingApproval} tone="warning" />
        <StatCard label="Publicados" value={published} tone="primary" />
        <StatCard
          label="Clientes ativos"
          value={(clients.data ?? []).filter((c) => c.status === "ATIVO").length}
          hint={`MRR ${brl(
            (clients.data ?? [])
              .filter((c) => c.status === "ATIVO")
              .reduce((s, c) => s + (c.monthly_value ?? 0), 0),
          )}`}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="CTR médio" value={pct(metrics.ctr)} />
        <StatCard label="CPC médio" value={brl(metrics.cpc)} />
        <StatCard label="CPL / CPA" value={`${brl(metrics.cpl)} / ${brl(metrics.cpa)}`} />
        <StatCard label="ROAS" value={dec(metrics.roas)} tone="neon" hint={`Investido ${brl(metrics.spend)}`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="surface-panel p-4">
          <h2 className="text-sm font-semibold">Produção por status</h2>
          {byStatus.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Sem criativos ainda.</p>
          ) : (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byStatus}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="status" tick={{ fontSize: 10 }} interval={0} angle={-30} height={60} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }} />
                  <Bar dataKey="total" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="surface-panel p-4">
          <h2 className="text-sm font-semibold">Investimento x receita</h2>
          {timeline.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Sem performance registrada.</p>
          ) : (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }} />
                  <Line type="monotone" dataKey="spend" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="revenue" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="surface-panel p-4">
          <h2 className="text-sm font-semibold">Minha agenda de hoje</h2>
          <div className="mt-3 space-y-2">
            {lateTasks.length === 0 && todayTasks.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Nada vencendo hoje.</p>
            ) : (
              [...lateTasks, ...todayTasks].slice(0, 8).map((t) => (
                <Link
                  key={t.id}
                  to="/tarefas"
                  className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm hover:border-primary/40"
                >
                  <span className="truncate">{t.title}</span>
                  <Tag tone={isOverdue(t.due_on) ? "destructive" : "info"}>
                    {isOverdue(t.due_on) ? "Atrasado" : "Hoje"}
                  </Tag>
                </Link>
              ))
            )}
          </div>
        </section>

        <section className="surface-panel p-4">
          <h2 className="text-sm font-semibold">Melhores criativos por ROAS</h2>
          <div className="mt-3 space-y-2">
            {ranking.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Registre performance para ver o ranking.
              </p>
            ) : (
              ranking.map(({ creative, m }) => (
                <Link
                  key={creative.id}
                  to="/criativos/$id"
                  params={{ id: creative.id }}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm hover:border-primary/40"
                >
                  <span className="truncate">
                    <span className="text-muted-foreground">{creative.code} </span>
                    {creative.name}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{num(m.impressions)} impr.</span>
                    <Tag tone={m.roas >= 2 ? "neon" : "muted"}>ROAS {dec(m.roas)}</Tag>
                  </span>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="surface-panel p-4">
          <h2 className="text-sm font-semibold">Clientes que precisam de atenção</h2>
          <div className="mt-3 space-y-2">
            {attention.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Todos saudáveis.</p>
            ) : (
              attention.map((c) => (
                <Link
                  key={c.id}
                  to="/clientes/$id"
                  params={{ id: c.id }}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm hover:border-primary/40"
                >
                  <span className="truncate">{c.name}</span>
                  <span className="flex gap-2">
                    <Tag tone={toneFrom(CLIENT_STATUSES, c.status)}>
                      {labelFrom(CLIENT_STATUSES, c.status)}
                    </Tag>
                    <Tag tone={c.health === "RISCO" ? "destructive" : "warning"}>{c.health}</Tag>
                  </span>
                </Link>
              ))
            )}
          </div>
        </section>

        <section className="surface-panel p-4">
          <h2 className="text-sm font-semibold">Diagnósticos automáticos</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Indícios baseados nos dados registrados — não são causas comprovadas.
          </p>
          <div className="mt-3 space-y-2">
            {diagnoses.length === 0 ? (
              <EmptyState title="Sem diagnósticos" description="Registre performance para receber diagnósticos." />
            ) : (
              diagnoses.slice(0, 5).map((d, i) => (
                <div key={i} className="rounded-lg border border-border px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Tag tone={DIAG_TONE[d.level]}>{d.title}</Tag>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{d.explanation}</p>
                  {d.action ? <p className="mt-1 text-xs text-primary">Ação: {d.action}</p> : null}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
