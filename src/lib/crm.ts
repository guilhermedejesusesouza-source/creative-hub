/** Constantes do módulo CRM / Operação — centralizadas. */

export const CLIENT_STATUSES = [
  { value: "PROSPECT", label: "Prospect", tone: "muted" },
  { value: "ONBOARDING", label: "Onboarding", tone: "info" },
  { value: "ATIVO", label: "Ativo", tone: "success" },
  { value: "ATENCAO", label: "Atenção", tone: "warning" },
  { value: "RISCO", label: "Risco", tone: "destructive" },
  { value: "PAUSADO", label: "Pausado", tone: "muted" },
  { value: "RENOVACAO", label: "Renovação", tone: "info" },
  { value: "UPSELL", label: "Upsell", tone: "primary" },
  { value: "INADIMPLENTE", label: "Inadimplente", tone: "destructive" },
  { value: "ENCERRANDO", label: "Encerrando", tone: "warning" },
  { value: "ENCERRADO", label: "Encerrado", tone: "muted" },
  { value: "EX_CLIENTE", label: "Ex-cliente", tone: "muted" },
] as const;

export const HEALTH_STATUSES = [
  { value: "SAUDAVEL", label: "Saudável", tone: "success" },
  { value: "ATENCAO", label: "Atenção", tone: "warning" },
  { value: "RISCO", label: "Risco", tone: "destructive" },
] as const;

export const PIPELINE_STAGES = [
  { value: "LEAD", label: "Lead" },
  { value: "ABORDADO_1", label: "Abordado 1" },
  { value: "ABORDADO_2", label: "Abordado 2" },
  { value: "ABORDADO_3", label: "Abordado 3" },
  { value: "ABORDADO_4", label: "Abordado 4" },
  { value: "ABORDADO_5", label: "Abordado 5" },
  { value: "ABORDADO_6", label: "Abordado 6" },
  { value: "ABORDADO_7", label: "Abordado 7" },
  { value: "QUALIFICACAO", label: "Qualificação" },
  { value: "REUNIAO", label: "Reunião" },
  { value: "PROPOSTA", label: "Proposta" },
  { value: "FOLLOW_UP_1", label: "Follow-up 1" },
  { value: "FOLLOW_UP_2", label: "Follow-up 2" },
  { value: "FOLLOW_UP_3", label: "Follow-up 3" },
  { value: "FOLLOW_UP_4", label: "Follow-up 4" },
  { value: "FOLLOW_UP_5", label: "Follow-up 5" },
  { value: "FOLLOW_UP_6", label: "Follow-up 6" },
  { value: "FOLLOW_UP_7", label: "Follow-up 7" },
  { value: "NEGOCIACAO", label: "Negociação" },
  { value: "FECHADO", label: "Fechado" },
  { value: "PERDIDO", label: "Perdido" },
  { value: "NUTRICAO", label: "Em nutrição" },
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number]["value"];

export const TASK_STATUSES = [
  { value: "PENDENTE", label: "Pendente", tone: "muted" },
  { value: "EM_ANDAMENTO", label: "Em andamento", tone: "info" },
  { value: "CONCLUIDA", label: "Concluída", tone: "success" },
  { value: "CANCELADA", label: "Cancelada", tone: "muted" },
] as const;

export const TASK_TYPES = [
  { value: "COMERCIAL", label: "Comercial" },
  { value: "OPERACIONAL", label: "Operacional" },
  { value: "TRAFEGO", label: "Tráfego" },
  { value: "CRIATIVO", label: "Criativo" },
  { value: "REUNIAO", label: "Reunião" },
  { value: "FINANCEIRO", label: "Financeiro" },
  { value: "OUTRO", label: "Outro" },
] as const;

export const RECURRENCES = [
  { value: "NENHUMA", label: "Sem recorrência" },
  { value: "DIARIA", label: "Diária" },
  { value: "SEMANAL", label: "Semanal" },
  { value: "QUINZENAL", label: "Quinzenal" },
  { value: "MENSAL", label: "Mensal" },
  { value: "PERSONALIZADA", label: "Personalizada" },
] as const;

export const FOLLOWUP_STATUSES = [
  { value: "PENDENTE", label: "Pendente", tone: "muted" },
  { value: "HOJE", label: "Hoje", tone: "info" },
  { value: "ATRASADO", label: "Atrasado", tone: "destructive" },
  { value: "CONCLUIDO", label: "Concluído", tone: "success" },
  { value: "CANCELADO", label: "Cancelado", tone: "muted" },
] as const;

export const CHANNELS = [
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "LIGACAO", label: "Ligação" },
  { value: "EMAIL", label: "E-mail" },
  { value: "INSTAGRAM", label: "Instagram" },
  { value: "REUNIAO", label: "Reunião" },
  { value: "PRESENCIAL", label: "Presencial" },
] as const;

export const NOTE_CATEGORIES = [
  { value: "GERAL", label: "Geral" },
  { value: "COMERCIAL", label: "Comercial" },
  { value: "ESTRATEGIA", label: "Estratégia" },
  { value: "TRAFEGO", label: "Tráfego" },
  { value: "FINANCEIRO", label: "Financeiro" },
  { value: "RISCO", label: "Risco" },
] as const;

export const LEAD_SOURCES = [
  { value: "INDICACAO", label: "Indicação" },
  { value: "INSTAGRAM", label: "Instagram" },
  { value: "PROSPECCAO", label: "Prospecção ativa" },
  { value: "SITE", label: "Site" },
  { value: "EVENTO", label: "Evento" },
  { value: "TRAFEGO_PAGO", label: "Tráfego pago" },
  { value: "OUTRO", label: "Outro" },
] as const;

export const LOSS_REASONS = [
  { value: "PRECO", label: "Preço" },
  { value: "SEM_BUDGET", label: "Sem orçamento" },
  { value: "TIMING", label: "Momento errado" },
  { value: "CONCORRENTE", label: "Escolheu concorrente" },
  { value: "SEM_FIT", label: "Sem fit" },
  { value: "SEM_RESPOSTA", label: "Parou de responder" },
  { value: "INTERNO", label: "Vai fazer internamente" },
  { value: "OUTRO", label: "Outro" },
] as const;

export const FOLLOW_UP_STATUSES = FOLLOWUP_STATUSES;

export function leadTemperature(score: number) {
  if (score >= 70) return { value: "HOT", label: "Hot", tone: "destructive" as const };
  if (score >= 40) return { value: "WARM", label: "Warm", tone: "warning" as const };
  return { value: "COLD", label: "Cold", tone: "info" as const };
}

/** Sugere a data do próximo contato a partir do número do contato feito. */
export function suggestNextContact(contactNumber: number) {
  const days = contactNumber <= 2 ? 2 : contactNumber <= 5 ? 3 : 5;
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Sugere a data do próximo contato conforme a etapa de abordagem. */
export function suggestNextContactByStage(from = new Date(), stage?: string | null) {
  const days = stage?.startsWith("ABORDADO") ? 2 : stage?.startsWith("FOLLOW_UP") ? 3 : 5;
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function isOverdue(due?: string | null) {
  if (!due) return false;
  return due < new Date().toISOString().slice(0, 10);
}

export function isToday(due?: string | null) {
  if (!due) return false;
  return due === new Date().toISOString().slice(0, 10);
}

export function labelFrom(
  list: readonly { value: string; label: string }[],
  value?: string | null,
) {
  return list.find((i) => i.value === value)?.label ?? value ?? "—";
}

export function toneFrom(
  list: readonly { value: string; label: string; tone?: string }[],
  value?: string | null,
) {
  return list.find((i) => i.value === value)?.tone ?? "muted";
}
