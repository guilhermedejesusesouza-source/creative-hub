/**
 * Domínio central do Creative OS: status, enums, rótulos, cálculo de scores
 * e regras de diagnóstico. Tudo que é "regra de negócio" vive aqui.
 */

export const CREATIVE_STATUSES = [
  "BACKLOG",
  "BRIEFING",
  "ESTRATEGIA",
  "COPY",
  "DIRECAO",
  "PRODUCAO",
  "REVISAO",
  "APROVACAO",
  "APROVADO",
  "PUBLICADO",
  "ANALISE",
  "ITERAR",
] as const;
export type CreativeStatus = (typeof CREATIVE_STATUSES)[number];

export const STATUS_LABELS: Record<CreativeStatus, string> = {
  BACKLOG: "Backlog",
  BRIEFING: "Briefing",
  ESTRATEGIA: "Estratégia",
  COPY: "Copy",
  DIRECAO: "Direção",
  PRODUCAO: "Produção",
  REVISAO: "Revisão",
  APROVACAO: "Aprovação",
  APROVADO: "Aprovado",
  PUBLICADO: "Publicado",
  ANALISE: "Análise",
  ITERAR: "Iterar",
};

export const AWARENESS_LEVELS = [
  { value: "unaware", label: "Unaware" },
  { value: "problem_aware", label: "Problem Aware" },
  { value: "solution_aware", label: "Solution Aware" },
  { value: "product_aware", label: "Product Aware" },
  { value: "most_aware", label: "Most Aware" },
] as const;

export const FUNNEL_STAGES = [
  { value: "TOFU", label: "TOFU" },
  { value: "MOFU", label: "MOFU" },
  { value: "BOFU", label: "BOFU" },
  { value: "Remarketing", label: "Remarketing" },
] as const;

export const PLATFORMS = [
  "Meta",
  "Instagram",
  "TikTok",
  "Google",
  "YouTube",
  "LinkedIn",
  "Pinterest",
] as const;

export const FORMATS = [
  "Vídeo 9:16",
  "Vídeo 16:9",
  "Reels",
  "Carrossel 4:5",
  "Estático 1:1",
  "Estático 4:5",
  "Story",
] as const;

export const PRIORITIES = [
  { value: "alta", label: "Alta" },
  { value: "media", label: "Média" },
  { value: "baixa", label: "Baixa" },
] as const;

export const ANGLE_CATEGORIES = [
  { value: "pain", label: "Dor" },
  { value: "desire", label: "Desejo" },
  { value: "benefit", label: "Benefício" },
  { value: "mechanism", label: "Mecanismo" },
  { value: "error", label: "Erro" },
  { value: "objection", label: "Objeção" },
  { value: "proof", label: "Prova" },
  { value: "comparison", label: "Comparação" },
  { value: "demonstration", label: "Demonstração" },
  { value: "offer", label: "Oferta" },
  { value: "novelty", label: "Novidade" },
  { value: "contrarian", label: "Contra-intuitivo" },
] as const;

export const HOOK_CATEGORIES = [
  { value: "curiosidade", label: "Curiosidade" },
  { value: "dor", label: "Dor" },
  { value: "beneficio", label: "Benefício" },
  { value: "prova", label: "Prova" },
  { value: "contraste", label: "Contraste" },
  { value: "pergunta", label: "Pergunta" },
  { value: "quebra_de_padrao", label: "Quebra de padrão" },
  { value: "urgencia", label: "Urgência" },
  { value: "autoridade", label: "Autoridade" },
] as const;

export const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "strategist", label: "Estrategista" },
  { value: "copywriter", label: "Copywriter" },
  { value: "designer", label: "Designer" },
  { value: "editor", label: "Editor" },
  { value: "traffic_manager", label: "Gestor de tráfego" },
  { value: "client", label: "Cliente" },
] as const;
export type Role = (typeof ROLES)[number]["value"];

export const APPROVAL_STATUSES = [
  { value: "pendente", label: "Pendente" },
  { value: "aprovado", label: "Aprovado" },
  { value: "alteracao", label: "Alteração solicitada" },
  { value: "rejeitado", label: "Rejeitado" },
] as const;

export const ITERATION_VARIABLES = [
  "hook",
  "ângulo",
  "oferta",
  "visual",
  "CTA",
  "prova",
  "formato",
  "plataforma",
] as const;

export function labelOf(
  list: readonly { value: string; label: string }[],
  value?: string | null,
): string {
  if (!value) return "—";
  return list.find((i) => i.value === value)?.label ?? value;
}

/* ---------------------------------- Scores --------------------------------- */

export const SCORE_WEIGHTS = [
  { key: "score_clarity", label: "Clareza da oferta", max: 20 },
  { key: "score_hook", label: "Hook", max: 20 },
  { key: "score_hierarchy", label: "Hierarquia visual", max: 15 },
  { key: "score_relevance", label: "Relevância para o público", max: 15 },
  { key: "score_differentiation", label: "Diferenciação", max: 10 },
  { key: "score_proof", label: "Prova / credibilidade", max: 10 },
  { key: "score_cta", label: "CTA", max: 5 },
  { key: "score_platform_fit", label: "Adequação à plataforma", max: 5 },
] as const;

export type ScoreKey = (typeof SCORE_WEIGHTS)[number]["key"];

export function creativeScore(creative: Record<string, unknown>) {
  const breakdown = SCORE_WEIGHTS.map((w) => {
    const raw = Number(creative?.[w.key] ?? 0);
    const value = Math.max(0, Math.min(w.max, isFinite(raw) ? raw : 0));
    return { ...w, value };
  });
  const total = breakdown.reduce((s, b) => s + b.value, 0);
  const recommendations = breakdown
    .filter((b) => b.value / b.max < 0.7)
    .map((b) => recommendationFor(b.key, b.label));
  return { total, breakdown, recommendations };
}

function recommendationFor(key: string, label: string) {
  const map: Record<string, string> = {
    score_clarity: "Deixe a oferta explícita em uma frase: o que é, para quem e o que muda.",
    score_hook: "Reescreva os 2 primeiros segundos com uma pergunta, número ou contraste.",
    score_hierarchy: "Aplique a hierarquia Hook → Prova/Benefício → Contexto → CTA.",
    score_relevance: "Use a linguagem real do público (VOC) e ajuste o nível de consciência.",
    score_differentiation: "Explicite o mecanismo único: o que só você faz assim.",
    score_proof: "Inclua depoimento, número verificável ou demonstração.",
    score_cta: "Use um CTA único, específico e coerente com o próximo passo.",
    score_platform_fit: "Ajuste proporção, ritmo e legendas ao formato nativo da plataforma.",
  };
  return { area: label, action: map[key] ?? "Revisar este critério." };
}

/* ------------------------------- Performance ------------------------------- */

export type PerformanceRow = {
  spend?: number | null;
  impressions?: number | null;
  reach?: number | null;
  clicks?: number | null;
  lpv?: number | null;
  conversions?: number | null;
  leads?: number | null;
  purchases?: number | null;
  revenue?: number | null;
};

export type Metrics = {
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  lpv: number;
  conversions: number;
  leads: number;
  purchases: number;
  revenue: number;
  ctr: number;
  cpc: number;
  cpm: number;
  cvr: number;
  cpl: number;
  cpa: number;
  roas: number;
};

const n = (v: unknown) => (typeof v === "number" && isFinite(v) ? v : Number(v ?? 0) || 0);
const div = (a: number, b: number) => (b > 0 ? a / b : 0);

type Totals = Pick<
  Metrics,
  | "spend"
  | "impressions"
  | "reach"
  | "clicks"
  | "lpv"
  | "conversions"
  | "leads"
  | "purchases"
  | "revenue"
>;

export function aggregateMetrics(rows: PerformanceRow[]): Metrics {
  const t: Totals = rows.reduce<Totals>(
    (acc, r) => ({
      spend: acc.spend + n(r.spend),
      impressions: acc.impressions + n(r.impressions),
      reach: acc.reach + n(r.reach),
      clicks: acc.clicks + n(r.clicks),
      lpv: acc.lpv + n(r.lpv),
      conversions: acc.conversions + n(r.conversions),
      leads: acc.leads + n(r.leads),
      purchases: acc.purchases + n(r.purchases),
      revenue: acc.revenue + n(r.revenue),
    }),
    {
      spend: 0,
      impressions: 0,
      reach: 0,
      clicks: 0,
      lpv: 0,
      conversions: 0,
      leads: 0,
      purchases: 0,
      revenue: 0,
    },
  );
  return {
    ...t,
    ctr: div(t.clicks, t.impressions) * 100,
    cpc: div(t.spend, t.clicks),
    cpm: div(t.spend, t.impressions) * 1000,
    cvr: div(t.conversions, t.clicks) * 100,
    cpl: div(t.spend, t.leads),
    cpa: div(t.spend, t.purchases || t.conversions),
    roas: div(t.revenue, t.spend),
  };
}

/** Score de performance (0-100) — separado da qualidade criativa. */
export function performanceScore(m: Metrics) {
  if (m.impressions === 0) return { total: 0, parts: [] as { label: string; value: number }[] };
  const parts = [
    { label: "CTR", value: Math.min(30, (m.ctr / 2) * 30) },
    { label: "CVR", value: Math.min(25, (m.cvr / 5) * 25) },
    { label: "ROAS", value: Math.min(25, (m.roas / 3) * 25) },
    { label: "Volume", value: Math.min(20, (m.impressions / 100000) * 20) },
  ].map((p) => ({ ...p, value: Math.round(p.value) }));
  return { total: parts.reduce((s, p) => s + p.value, 0), parts };
}

/* ---------------------------- Creative Intelligence ---------------------------- */

export type Diagnosis = {
  level: "positivo" | "atencao" | "critico" | "oportunidade";
  title: string;
  explanation: string;
  action: string;
};

export function diagnose(m: Metrics): Diagnosis[] {
  const out: Diagnosis[] = [];
  if (m.impressions < 500) {
    out.push({
      level: "oportunidade",
      title: "Volume baixo para conclusão",
      explanation:
        "Ainda há poucos dados. Os indicadores tendem a oscilar muito nesse volume de entrega.",
      action: "Acumule mais entrega antes de decidir pausar ou escalar.",
    });
    return out;
  }
  if (m.ctr < 0.8) {
    out.push({
      level: "critico",
      title: "CTR baixo",
      explanation:
        "CTR abaixo do esperado normalmente indica hook ou conceito que não prende nos primeiros segundos.",
      action: "Teste novo hook e revise a promessa inicial mantendo o resto igual.",
    });
  }
  if (m.ctr >= 1.5 && m.cvr > 0 && m.cvr < 1.5) {
    out.push({
      level: "atencao",
      title: "CTR alto com conversão baixa",
      explanation:
        "O clique acontece, mas a conversão não. Costuma indicar desalinhamento entre promessa, oferta e página de destino.",
      action: "Alinhe headline da página com a promessa do criativo e revise a oferta.",
    });
  }
  if (m.ctr >= 1.5 && m.cpa > 0 && m.cpa <= 60) {
    out.push({
      level: "positivo",
      title: "Potencial vencedor",
      explanation: "Boa taxa de clique combinada com custo por aquisição competitivo.",
      action: "Aumente investimento gradualmente e crie variações mudando uma variável.",
    });
  }
  if (m.cpm > 45) {
    out.push({
      level: "atencao",
      title: "CPM alto",
      explanation:
        "Custo por mil impressões elevado pode indicar audiência concorrida ou posicionamento caro.",
      action: "Teste públicos mais amplos e revise posicionamentos.",
    });
  }
  if (m.cpc > 3 && m.ctr < 1) {
    out.push({
      level: "critico",
      title: "CPC alto com CTR baixo",
      explanation: "Pouca relevância percebida encarece cada clique.",
      action: "Revise hook, primeira dobra do texto e adequação ao público.",
    });
  }
  if (m.roas >= 2 && m.spend < 1500) {
    out.push({
      level: "oportunidade",
      title: "Boa performance com pouco investimento",
      explanation: "O retorno está saudável em um volume ainda pequeno.",
      action: "Oportunidade de escala controlada com teste de novos públicos.",
    });
  }
  if (out.length === 0) {
    out.push({
      level: "positivo",
      title: "Indicadores dentro do esperado",
      explanation: "Nenhum sinal relevante de problema nos dados registrados.",
      action: "Mantenha o criativo ativo e siga monitorando.",
    });
  }
  return out;
}

/* -------------------------------- Formatação ------------------------------- */

export const brl = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    isFinite(v) ? v : 0,
  );
export const num = (v: number) => new Intl.NumberFormat("pt-BR").format(Math.round(v || 0));
export const pct = (v: number) => `${(v || 0).toFixed(2)}%`;
export const dec = (v: number) => (v || 0).toFixed(2);

export const dateBR = (v?: string | null) =>
  v ? new Date(v.length <= 10 ? `${v}T12:00:00` : v).toLocaleDateString("pt-BR") : "—";

export const dateTimeBR = (v?: string | null) =>
  v
    ? new Date(v).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";
