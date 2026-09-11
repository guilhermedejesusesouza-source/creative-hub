import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import { EmptyState, LoadingRows, PageHeader, StatCard, Tag } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  CHANNELS,
  FOLLOW_UP_STATUSES,
  LOSS_REASONS,
  PIPELINE_STAGES,
  isOverdue,
  labelFrom,
  leadTemperature,
  suggestNextContact,
  toneFrom,
} from "@/lib/crm";
import { useRow, useRows, useSaveRow } from "@/lib/data";
import { brl, dateBR, dateTimeBR } from "@/lib/domain";

export const Route = createFileRoute("/_authenticated/leads/$id")({
  head: () => ({
    meta: [
      { title: "Lead — Creative OS" },
      { name: "description", content: "Detalhe do lead: etapa, score, contatos, follow-ups e motivo de perda." },
      { property: "og:title", content: "Lead — Creative OS" },
      { property: "og:description", content: "Detalhe do lead no pipeline." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LeadDetail,
  errorComponent: () => <EmptyState title="Não foi possível carregar este lead" />,
  notFoundComponent: () => <EmptyState title="Lead não encontrado" />,
});

type Lead = Record<string, unknown> & {
  id: string;
  name: string;
  stage: string;
  score: number | null;
  contact_count: number | null;
};

function LeadDetail() {
  const { id } = Route.useParams();
  const { workspaceId, user } = useAuth();
  const lead = useRow<Lead>("leads", id);
  const save = useSaveRow("leads", { success: "Lead atualizado" });
  const saveContact = useSaveRow("lead_contacts", { success: "Contato registrado" });
  const saveFollowUp = useSaveRow("follow_ups", { success: "Follow-up salvo" });

  const contacts = useRows<{
    id: string;
    channel: string;
    outcome: string | null;
    message: string | null;
    happened_at: string;
    number: number | null;
  }>("lead_contacts", workspaceId, { eq: { lead_id: id }, orderBy: "happened_at" });
  const followUps = useRows<{
    id: string;
    number: number | null;
    due_on: string | null;
    status: string;
    channel: string | null;
    next_action: string | null;
  }>("follow_ups", workspaceId, { eq: { lead_id: id }, orderBy: "due_on", ascending: true });

  const [lossOpen, setLossOpen] = useState(false);
  const [lossReason, setLossReason] = useState(LOSS_REASONS[0]?.value ?? "OUTRO");
  const [lossNote, setLossNote] = useState("");

  const [contactForm, setContactForm] = useState({
    channel: "WHATSAPP",
    outcome: "SEM_RESPOSTA",
    message: "",
  });

  if (lead.isLoading) return <LoadingRows rows={5} />;
  const l = lead.data;
  if (!l) return <EmptyState title="Lead não encontrado" />;

  const temp = leadTemperature(Number(l.score ?? 0));
  const count = Number(l.contact_count ?? 0);

  async function changeStage(stage: string) {
    if (stage === "PERDIDO") {
      setLossOpen(true);
      return;
    }
    await save.mutateAsync({ id, stage });
    if (stage === "PROPOSTA") {
      await saveFollowUp.mutateAsync({
        workspace_id: workspaceId,
        lead_id: id,
        number: (followUps.data ?? []).length + 1,
        due_on: suggestNextContact(3),
        status: "PENDENTE",
        channel: "WHATSAPP",
        next_action: "Confirmar recebimento da proposta",
      });
    }
  }

  async function registerContact(e: React.FormEvent) {
    e.preventDefault();
    const next = count + 1;
    await saveContact.mutateAsync({
      workspace_id: workspaceId,
      lead_id: id,
      number: next,
      channel: contactForm.channel,
      outcome: contactForm.outcome,
      message: contactForm.message || null,
      happened_at: new Date().toISOString(),
      author: user?.email ?? null,
    });
    await save.mutateAsync({
      id,
      contact_count: next,
      last_contact_on: new Date().toISOString().slice(0, 10),
      next_contact_on: suggestNextContact(next),
    });
    setContactForm({ ...contactForm, message: "" });
  }

  async function confirmLoss() {
    await save.mutateAsync({
      id,
      stage: "PERDIDO",
      loss_reason: lossReason,
      loss_note: lossNote || null,
      lost_at: new Date().toISOString(),
      lost_by: user?.email ?? null,
    });
    setLossOpen(false);
  }

  return (
    <div className="space-y-5">
      <Link to="/leads" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Voltar para o pipeline
      </Link>

      <PageHeader
        title={l.name}
        description={String(l["company"] ?? " ")}
        actions={
          <Select value={l.stage} onValueChange={changeStage}>
            <SelectTrigger className="w-56">
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
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard label="Temperatura" value={`${temp.label} · ${l.score ?? 0}`} tone={temp.tone === "destructive" ? "destructive" : "primary"} />
        <StatCard label="Contatos" value={`${Math.min(count, 7)} de 7`} />
        <StatCard label="Valor potencial" value={brl(Number(l["potential_value"] ?? 0))} tone="neon" />
        <StatCard label="Próximo contato" value={dateBR(String(l["next_contact_on"] ?? "")) || "—"} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="surface-panel p-4">
          <h2 className="text-sm font-semibold">Qualificação</h2>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
            {[
              ["Dor", l["pain"]],
              ["Necessidade", l["need"]],
              ["Orçamento", l["budget"]],
              ["Urgência", l["urgency"]],
              ["Fit", l["fit"]],
              ["Origem", l["source"]],
              ["Responsável", l["owner"]],
              ["Segmento", l["segment"]],
            ].map(([k, v]) => (
              <div key={String(k)}>
                <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{String(k)}</dt>
                <dd className="mt-0.5">{v ? String(v) : "—"}</dd>
              </div>
            ))}
          </dl>
          {l.stage === "PERDIDO" ? (
            <div className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
              <p className="font-medium">Perdido: {labelFrom(LOSS_REASONS, String(l["loss_reason"] ?? ""))}</p>
              {l["loss_note"] ? <p className="text-muted-foreground">{String(l["loss_note"])}</p> : null}
            </div>
          ) : null}
        </section>

        <form className="surface-panel space-y-3 p-4" onSubmit={registerContact}>
          <h2 className="text-sm font-semibold">Registrar contato ({Math.min(count + 1, 7)} de 7)</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Canal</Label>
              <Select
                value={contactForm.channel}
                onValueChange={(v) => setContactForm((f) => ({ ...f, channel: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CHANNELS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Resultado</Label>
              <Select
                value={contactForm.outcome}
                onValueChange={(v) => setContactForm((f) => ({ ...f, outcome: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["SEM_RESPOSTA", "RESPONDEU", "AGENDOU", "RECUSOU", "PEDIU_RETORNO"].map((o) => (
                    <SelectItem key={o} value={o}>
                      {o.replace("_", " ").toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Textarea
            placeholder="Mensagem enviada / observação"
            value={contactForm.message}
            onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
          />
          <p className="text-xs text-muted-foreground">
            Próximo contato sugerido: {dateBR(suggestNextContact(count + 1))} (editável no campo do lead).
          </p>
          <Button type="submit" size="sm" disabled={saveContact.isPending}>
            Registrar contato
          </Button>
        </form>
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="surface-panel">
          <h2 className="border-b border-border px-4 py-3 text-sm font-semibold">Histórico de contatos</h2>
          {(contacts.data ?? []).length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground">Nenhum contato registrado.</p>
          ) : (
            <ul className="divide-y divide-border">
              {[...(contacts.data ?? [])].reverse().map((c) => (
                <li key={c.id} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Contato {c.number ?? "—"} · {c.channel}</p>
                    <Tag>{c.outcome ?? "—"}</Tag>
                  </div>
                  {c.message ? <p className="mt-1 text-sm text-muted-foreground">{c.message}</p> : null}
                  <p className="mt-1 text-[11px] text-muted-foreground">{dateTimeBR(c.happened_at)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="surface-panel">
          <h2 className="border-b border-border px-4 py-3 text-sm font-semibold">Follow-ups</h2>
          {(followUps.data ?? []).length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground">Nenhum follow-up programado.</p>
          ) : (
            <ul className="divide-y divide-border">
              {(followUps.data ?? []).map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div>
                    <p className="text-sm">Follow-up {f.number ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{f.next_action ?? "—"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{dateBR(f.due_on)}</span>
                    <Tag
                      tone={
                        f.status !== "CONCLUIDO" && isOverdue(f.due_on)
                          ? "destructive"
                          : toneFrom(FOLLOW_UP_STATUSES, f.status)
                      }
                    >
                      {f.status !== "CONCLUIDO" && isOverdue(f.due_on)
                        ? "Atrasado"
                        : labelFrom(FOLLOW_UP_STATUSES, f.status)}
                    </Tag>
                    {f.status !== "CONCLUIDO" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => saveFollowUp.mutate({ id: f.id, status: "CONCLUIDO" })}
                      >
                        Concluir
                      </Button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <Dialog open={lossOpen} onOpenChange={setLossOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Motivo da perda</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Motivo *</Label>
              <Select value={lossReason} onValueChange={setLossReason}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOSS_REASONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="loss-note">Observação</Label>
              <Textarea id="loss-note" value={lossNote} onChange={(e) => setLossNote(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLossOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmLoss} disabled={save.isPending}>
              Marcar como perdido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
