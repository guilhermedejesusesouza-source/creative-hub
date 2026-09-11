import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Copy } from "lucide-react";
import { useState } from "react";

import { EmptyState, LoadingRows, PageHeader, StatCard, Tag } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
import { useRow, useRows, useSaveRow } from "@/lib/data";
import {
  CREATIVE_STATUSES,
  ITERATION_VARIABLES,
  SCORE_WEIGHTS,
  STATUS_LABELS,
  aggregateMetrics,
  brl,
  creativeScore,
  dateTimeBR,
  dec,
  diagnose,
  num,
  performanceScore,
  pct,
  type CreativeStatus,
} from "@/lib/domain";

export const Route = createFileRoute("/_authenticated/criativos/$id")({
  head: () => ({
    meta: [
      { title: "Criativo — Creative OS" },
      {
        name: "description",
        content:
          "Estratégia, conceito, direção, versões, aprovação, score e performance do criativo.",
      },
      { property: "og:title", content: "Criativo — Creative OS" },
      { property: "og:description", content: "Detalhe completo do criativo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CreativeDetail,
  errorComponent: () => <EmptyState title="Não foi possível carregar este criativo" />,
  notFoundComponent: () => <EmptyState title="Criativo não encontrado" />,
});

type Creative = Record<string, unknown> & { id: string; name: string; status: string };

function CreativeDetail() {
  const { id } = Route.useParams();
  const { workspaceId, user } = useAuth();
  const navigate = useNavigate();
  const creative = useRow<Creative>("creatives", id);
  const save = useSaveRow("creatives", { success: "Criativo atualizado" });
  const saveVersion = useSaveRow("creative_versions", { success: "Versão registrada" });
  const saveApproval = useSaveRow("approvals", { success: "Aprovação registrada" });

  const versions = useRows<{
    id: string;
    number: number | null;
    changes: string | null;
    author: string | null;
    created_at: string;
  }>("creative_versions", workspaceId, { eq: { creative_id: id }, orderBy: "created_at" });
  const approvals = useRows<{
    id: string;
    status: string;
    comment: string | null;
    reviewer: string | null;
    created_at: string;
  }>("approvals", workspaceId, { eq: { creative_id: id }, orderBy: "created_at" });
  const perf = useRows<Record<string, number | null>>("performances", workspaceId, {
    eq: { creative_id: id },
  });

  const [versionNote, setVersionNote] = useState("");
  const [approvalComment, setApprovalComment] = useState("");

  if (creative.isLoading) return <LoadingRows rows={6} />;
  const c = creative.data;
  if (!c) return <EmptyState title="Criativo não encontrado" />;
  const cData: Creative = c;

  const score = creativeScore(c);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metrics = aggregateMetrics((perf.data ?? []) as any);
  const pScore = performanceScore(metrics);
  const diags = diagnose(metrics);

  async function addVersion() {
    if (!versionNote.trim()) return;
    await saveVersion.mutateAsync({
      workspace_id: workspaceId,
      creative_id: id,
      number: (versions.data ?? []).length + 1,
      changes: versionNote.trim(),
      author: user?.email ?? null,
    });
    setVersionNote("");
  }

  async function review(status: string) {
    await saveApproval.mutateAsync({
      workspace_id: workspaceId,
      creative_id: id,
      status,
      comment: approvalComment || null,
      reviewer: user?.email ?? null,
    });
    await save.mutateAsync({
      id,
      status: status === "APROVADO" ? "APROVADO" : status === "REJEITADO" ? "REVISAO" : "REVISAO",
    });
    setApprovalComment("");
  }

  async function iterate(variable: string) {
    const row = await save.mutateAsync({
      workspace_id: workspaceId,
      name: `${cData.name} — iteração (${variable})`,
      client_id: cData["client_id"] ?? null,
      project_id: cData["project_id"] ?? null,
      platform: cData["platform"] ?? null,
      format: cData["format"] ?? null,
      funnel: cData["funnel"] ?? null,
      awareness: cData["awareness"] ?? null,
      angle_id: cData["angle_id"] ?? null,
      hook_id: cData["hook_id"] ?? null,
      hypothesis: `Se mudarmos ${variable}, então esperamos melhor resultado, porque essa é a variável mais provável de afetar o desempenho.`,
      status: "BACKLOG",
      parent_creative_id: id,
      iteration_variable: variable,
      owner: user?.email ?? null,
    });
    const newId = (row as { id?: string } | undefined)?.id;
    if (newId) navigate({ to: "/criativos/$id", params: { id: newId } });
  }

  return (
    <div className="space-y-5">
      <Link
        to="/criativos"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Voltar para criativos
      </Link>

      <PageHeader
        title={`${c["code"] ?? ""} ${c.name}`.trim()}
        description={
          [c["platform"], c["format"], c["funnel"], c["awareness"]]
            .filter(Boolean)
            .map(String)
            .join(" · ") || " "
        }
        actions={
          <Select value={c.status} onValueChange={(v) => save.mutate({ id, status: v })}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CREATIVE_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s as CreativeStatus]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard label="Creative Score" value={`${score.total}/100`} tone="primary" />
        <StatCard label="Performance Score" value={`${pScore}/100`} tone="neon" />
        <StatCard label="Versões" value={(versions.data ?? []).length} />
        <StatCard label="ROAS" value={dec(metrics.roas)} />
      </div>

      <Tabs defaultValue="estrategia">
        <TabsList className="flex-wrap">
          <TabsTrigger value="estrategia">Estratégia</TabsTrigger>
          <TabsTrigger value="score">Score</TabsTrigger>
          <TabsTrigger value="versoes">Versões</TabsTrigger>
          <TabsTrigger value="aprovacao">Aprovação</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="iterar">Iterar</TabsTrigger>
        </TabsList>

        <TabsContent value="estrategia" className="grid gap-4 lg:grid-cols-2">
          <FieldPanel
            title="Hipótese e conceito"
            fields={[
              ["Hipótese", c["hypothesis"]],
              ["Big idea", c["concept_big_idea"]],
              ["Mensagem principal", c["concept_message"]],
              ["Mecanismo", c["concept_mechanism"]],
              ["Prova", c["concept_proof"]],
              ["CTA", c["cta"]],
              ["Racional", c["concept_rationale"]],
            ]}
          />
          <FieldPanel
            title="Direção criativa"
            fields={[
              ["Composição", c["direction_composition"]],
              ["Hierarquia visual", c["direction_hierarchy"]],
              ["Elementos", c["direction_elements"]],
              ["Cenário", c["direction_scene"]],
              ["Estilo", c["direction_style"]],
              ["Tipografia", c["direction_typography"]],
              ["Cores", c["direction_colors"]],
              ["Observações de produção", c["direction_notes"]],
            ]}
          />
        </TabsContent>

        <TabsContent value="score" className="space-y-4">
          <div className="surface-panel space-y-4 p-4">
            <p className="text-sm text-muted-foreground">
              Avalie cada critério para calcular o Creative Score (qualidade criativa, separado da
              performance).
            </p>
            {SCORE_WEIGHTS.map((w) => (
              <div key={w.key} className="grid gap-2 sm:grid-cols-[1fr_6rem] sm:items-center">
                <div>
                  <Label htmlFor={w.key}>
                    {w.label} <span className="text-muted-foreground">(máx. {w.max})</span>
                  </Label>
                  <Progress value={(Number(c[w.key] ?? 0) / w.max) * 100} className="mt-2" />
                </div>
                <Input
                  id={w.key}
                  type="number"
                  min={0}
                  max={w.max}
                  defaultValue={Number(c[w.key] ?? 0)}
                  onBlur={(e) =>
                    save.mutate({
                      id,
                      [w.key]: Math.min(w.max, Math.max(0, Number(e.target.value || 0))),
                    })
                  }
                />
              </div>
            ))}
          </div>
          {score.recommendations.length > 0 ? (
            <div className="surface-panel p-4">
              <h2 className="text-sm font-semibold">Recomendações</h2>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                {score.recommendations.map((r) => (
                  <li key={r.area}>
                    <span className="text-foreground">{r.area}:</span> {r.action}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="versoes" className="space-y-4">
          <div className="surface-panel space-y-3 p-4">
            <Label htmlFor="v-note">O que mudou nesta versão</Label>
            <Textarea
              id="v-note"
              value={versionNote}
              onChange={(e) => setVersionNote(e.target.value)}
            />
            <Button size="sm" onClick={addVersion} disabled={saveVersion.isPending}>
              Registrar versão
            </Button>
          </div>
          {(versions.data ?? []).length === 0 ? (
            <EmptyState title="Nenhuma versão registrada" />
          ) : (
            <ul className="surface-panel divide-y divide-border">
              {[...(versions.data ?? [])].reverse().map((v) => (
                <li key={v.id} className="px-4 py-3">
                  <p className="text-sm font-medium">Versão {v.number ?? "—"}</p>
                  <p className="text-sm text-muted-foreground">{v.changes}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {dateTimeBR(v.created_at)} {v.author ? `· ${v.author}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="aprovacao" className="space-y-4">
          <div className="surface-panel space-y-3 p-4">
            <Label htmlFor="a-comment">Comentário</Label>
            <Textarea
              id="a-comment"
              value={approvalComment}
              onChange={(e) => setApprovalComment(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => review("APROVADO")}>
                Aprovar
              </Button>
              <Button size="sm" variant="outline" onClick={() => review("ALTERACAO")}>
                Solicitar alteração
              </Button>
              <Button size="sm" variant="destructive" onClick={() => review("REJEITADO")}>
                Rejeitar
              </Button>
            </div>
          </div>
          {(approvals.data ?? []).length === 0 ? (
            <EmptyState title="Sem histórico de aprovação" />
          ) : (
            <ul className="surface-panel divide-y divide-border">
              {[...(approvals.data ?? [])].reverse().map((a) => (
                <li key={a.id} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <Tag
                      tone={
                        a.status === "APROVADO"
                          ? "success"
                          : a.status === "REJEITADO"
                            ? "destructive"
                            : "warning"
                      }
                    >
                      {a.status}
                    </Tag>
                    <span className="text-[11px] text-muted-foreground">
                      {dateTimeBR(a.created_at)}
                    </span>
                  </div>
                  {a.comment ? (
                    <p className="mt-1 text-sm text-muted-foreground">{a.comment}</p>
                  ) : null}
                  {a.reviewer ? (
                    <p className="text-[11px] text-muted-foreground">{a.reviewer}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
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
          <div className="surface-panel p-4">
            <h2 className="text-sm font-semibold">Diagnósticos</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Leituras prováveis a partir dos números registrados — indícios, não causalidade
              comprovada.
            </p>
            {diags.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Sem dados suficientes para diagnosticar.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {diags.map((d) => (
                  <li key={d.title} className="rounded-md border border-border p-3">
                    <p className="text-sm font-medium">{d.title}</p>
                    <p className="text-sm text-muted-foreground">{d.explanation}</p>
                    <p className="mt-1 text-sm text-primary">{d.action}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </TabsContent>

        <TabsContent value="iterar">
          <div className="surface-panel p-4">
            <h2 className="text-sm font-semibold">Criar iteração alterando uma variável</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              O novo criativo nasce ligado a este como variação, mantendo a árvore de iterações.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {ITERATION_VARIABLES.map((v) => (
                <Button
                  key={v}
                  size="sm"
                  variant="outline"
                  onClick={() => iterate(v)}
                  disabled={save.isPending}
                >
                  <Copy className="mr-1.5 size-3.5" /> {v}
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FieldPanel({ title, fields }: { title: string; fields: [string, unknown][] }) {
  return (
    <section className="surface-panel p-4">
      <h2 className="text-sm font-semibold">{title}</h2>
      <dl className="mt-3 space-y-3 text-sm">
        {fields.map(([k, v]) => (
          <div key={k}>
            <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{k}</dt>
            <dd className="mt-0.5 whitespace-pre-wrap">{v ? String(v) : "—"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
