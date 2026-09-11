import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { EmptyState, LoadingRows, PageHeader, StatCard } from "@/components/ui-kit";
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
import { useAuth } from "@/hooks/useAuth";
import { useRows, useSaveRow } from "@/lib/data";
import { PLATFORMS, aggregateMetrics, brl, dateBR, dec, num, pct } from "@/lib/domain";

export const Route = createFileRoute("/_authenticated/performance")({
  head: () => ({
    meta: [
      { title: "Performance — Creative OS" },
      { name: "description", content: "Registre e analise métricas por criativo, plataforma, campanha e período." },
      { property: "og:title", content: "Performance — Creative OS" },
      { property: "og:description", content: "Resultados de mídia por criativo e período." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PerformancePage,
});

type Perf = {
  id: string;
  creative_id: string | null;
  client_id: string | null;
  platform: string | null;
  period_start: string | null;
  period_end: string | null;
  spend: number | null;
  impressions: number | null;
  clicks: number | null;
  leads: number | null;
  purchases: number | null;
  revenue: number | null;
};

function PerformancePage() {
  const { workspaceId } = useAuth();
  const perf = useRows<Perf>("performances", workspaceId, { orderBy: "period_start" });
  const creatives = useRows<{ id: string; name: string; code: string | null; client_id: string | null }>(
    "creatives",
    workspaceId,
  );
  const clients = useRows<{ id: string; name: string }>("clients", workspaceId, {
    orderBy: "name",
    ascending: true,
  });
  const [client, setClient] = useState("TODOS");
  const [platform, setPlatform] = useState("TODAS");

  const rows = useMemo(
    () =>
      (perf.data ?? []).filter(
        (p) =>
          (client === "TODOS" || p.client_id === client) &&
          (platform === "TODAS" || p.platform === platform),
      ),
    [perf.data, client, platform],
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const m = aggregateMetrics(rows as any);
  const creativeLabel = (id: string | null) => {
    const c = (creatives.data ?? []).find((x) => x.id === id);
    return c ? `${c.code ?? ""} ${c.name}`.trim() : "—";
  };

  const byPlatform = useMemo(() => {
    const map = new Map<string, { platform: string; spend: number; revenue: number }>();
    rows.forEach((r) => {
      const key = r.platform ?? "—";
      const cur = map.get(key) ?? { platform: key, spend: 0, revenue: 0 };
      cur.spend += Number(r.spend ?? 0);
      cur.revenue += Number(r.revenue ?? 0);
      map.set(key, cur);
    });
    return [...map.values()];
  }, [rows]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Performance"
        description="Dados inseridos manualmente hoje; a estrutura já está pronta para importação por API."
        actions={<NewPerfDialog creatives={creatives.data ?? []} clients={clients.data ?? []} />}
      />

      <div className="flex flex-wrap gap-3">
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
        <Select value={platform} onValueChange={setPlatform}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Plataforma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODAS">Todas as plataformas</SelectItem>
            {PLATFORMS.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Investimento" value={brl(m.spend)} />
        <StatCard label="Impressões" value={num(m.impressions)} />
        <StatCard label="CTR" value={pct(m.ctr)} />
        <StatCard label="CPC" value={brl(m.cpc)} />
        <StatCard label="Leads" value={num(m.leads)} />
        <StatCard label="CPL" value={brl(m.cpl)} />
        <StatCard label="CPA" value={brl(m.cpa)} />
        <StatCard label="ROAS" value={dec(m.roas)} tone="neon" />
      </div>

      {byPlatform.length > 0 ? (
        <section className="surface-panel p-4">
          <h2 className="text-sm font-semibold">Investimento e receita por plataforma</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byPlatform}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="platform" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }}
                />
                <Bar dataKey="spend" name="Investimento" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" name="Receita" fill="var(--neon)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      ) : null}

      {perf.isLoading ? (
        <LoadingRows />
      ) : rows.length === 0 ? (
        <EmptyState title="Nenhum registro de performance" description="Registre resultados para gerar diagnósticos." />
      ) : (
        <div className="surface-panel overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-4 py-3">Criativo</th>
                <th className="px-4 py-3">Plataforma</th>
                <th className="px-4 py-3">Período</th>
                <th className="px-4 py-3">Investimento</th>
                <th className="px-4 py-3">Impressões</th>
                <th className="px-4 py-3">Cliques</th>
                <th className="px-4 py-3">Leads</th>
                <th className="px-4 py-3">Receita</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3">{creativeLabel(r.creative_id)}</td>
                  <td className="px-4 py-3">{r.platform ?? "—"}</td>
                  <td className="px-4 py-3 text-xs">
                    {dateBR(r.period_start)} — {dateBR(r.period_end)}
                  </td>
                  <td className="px-4 py-3">{brl(Number(r.spend ?? 0))}</td>
                  <td className="px-4 py-3">{num(Number(r.impressions ?? 0))}</td>
                  <td className="px-4 py-3">{num(Number(r.clicks ?? 0))}</td>
                  <td className="px-4 py-3">{num(Number(r.leads ?? 0))}</td>
                  <td className="px-4 py-3">{brl(Number(r.revenue ?? 0))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function NewPerfDialog({
  creatives,
  clients,
}: {
  creatives: { id: string; name: string; code: string | null; client_id: string | null }[];
  clients: { id: string; name: string }[];
}) {
  const { workspaceId } = useAuth();
  const save = useSaveRow("performances", { success: "Performance registrada" });
  const [open, setOpen] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    creative_id: "",
    platform: "META",
    period_start: today,
    period_end: today,
    spend: "",
    impressions: "",
    clicks: "",
    leads: "",
    purchases: "",
    revenue: "",
    conversions: "",
    lpv: "",
    reach: "",
  });

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.creative_id) return;
    const creative = creatives.find((c) => c.id === form.creative_id);
    const n = (v: string) => (v === "" ? null : Number(v));
    await save.mutateAsync({
      workspace_id: workspaceId,
      creative_id: form.creative_id,
      client_id: creative?.client_id ?? null,
      platform: form.platform,
      period_start: form.period_start,
      period_end: form.period_end,
      spend: n(form.spend),
      impressions: n(form.impressions),
      reach: n(form.reach),
      clicks: n(form.clicks),
      lpv: n(form.lpv),
      conversions: n(form.conversions),
      leads: n(form.leads),
      purchases: n(form.purchases),
      revenue: n(form.revenue),
    });
    setOpen(false);
  }

  const numericFields: [keyof typeof form, string][] = [
    ["spend", "Investimento (R$)"],
    ["impressions", "Impressões"],
    ["reach", "Alcance"],
    ["clicks", "Cliques"],
    ["lpv", "Visualizações da LP"],
    ["conversions", "Conversões"],
    ["leads", "Leads"],
    ["purchases", "Compras"],
    ["revenue", "Receita (R$)"],
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1.5 size-4" /> Registrar performance
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Registrar performance</DialogTitle>
        </DialogHeader>
        <form className="space-y-3" onSubmit={submit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Criativo *</Label>
              <Select value={form.creative_id} onValueChange={(v) => set("creative_id", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {creatives.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {`${c.code ?? ""} ${c.name}`.trim()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Plataforma</Label>
              <Select value={form.platform} onValueChange={(v) => set("platform", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-start">Início</Label>
              <Input id="pf-start" type="date" value={form.period_start} onChange={(e) => set("period_start", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-end">Fim</Label>
              <Input id="pf-end" type="date" value={form.period_end} onChange={(e) => set("period_end", e.target.value)} />
            </div>
            {numericFields.map(([k, label]) => (
              <div key={k} className="space-y-1.5">
                <Label htmlFor={`pf-${k}`}>{label}</Label>
                <Input
                  id={`pf-${k}`}
                  type="number"
                  step="any"
                  value={form[k]}
                  onChange={(e) => set(k, e.target.value)}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={save.isPending}>
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
