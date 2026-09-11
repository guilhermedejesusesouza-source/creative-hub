import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { EmptyState, LoadingRows, PageHeader, StatCard, Tag } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { FOLLOW_UP_STATUSES, isOverdue, isToday, labelFrom, toneFrom } from "@/lib/crm";
import { useRows, useSaveRow } from "@/lib/data";
import { dateBR } from "@/lib/domain";

export const Route = createFileRoute("/_authenticated/follow-ups")({
  head: () => ({
    meta: [
      { title: "Follow-ups — Creative OS" },
      {
        name: "description",
        content: "Follow-ups numerados por lead, com status pendente, hoje, atrasado e concluído.",
      },
      { property: "og:title", content: "Follow-ups — Creative OS" },
      { property: "og:description", content: "Acompanhe todos os follow-ups comerciais." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FollowUpsPage,
});

type FollowUp = {
  id: string;
  number: number | null;
  due_on: string | null;
  status: string;
  channel: string | null;
  next_action: string | null;
  lead_id: string | null;
  client_id: string | null;
};

function FollowUpsPage() {
  const { workspaceId } = useAuth();
  const rows = useRows<FollowUp>("follow_ups", workspaceId, { orderBy: "due_on", ascending: true });
  const leads = useRows<{ id: string; name: string }>("leads", workspaceId);
  const save = useSaveRow("follow_ups", { success: "Follow-up atualizado" });
  const [filter, setFilter] = useState("ABERTOS");

  const leadName = (lid: string | null) =>
    (leads.data ?? []).find((l) => l.id === lid)?.name ?? "—";

  const list = useMemo(() => {
    const all = rows.data ?? [];
    if (filter === "HOJE") return all.filter((f) => isToday(f.due_on) && f.status !== "CONCLUIDO");
    if (filter === "ATRASADOS")
      return all.filter((f) => isOverdue(f.due_on) && f.status !== "CONCLUIDO");
    if (filter === "CONCLUIDOS") return all.filter((f) => f.status === "CONCLUIDO");
    if (filter === "ABERTOS")
      return all.filter((f) => f.status !== "CONCLUIDO" && f.status !== "CANCELADO");
    return all;
  }, [rows.data, filter]);

  const all = rows.data ?? [];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Follow-ups"
        description="Nenhum lead esquecido: acompanhe cada retorno programado."
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard
          label="Hoje"
          value={all.filter((f) => isToday(f.due_on) && f.status !== "CONCLUIDO").length}
        />
        <StatCard
          label="Atrasados"
          value={all.filter((f) => isOverdue(f.due_on) && f.status !== "CONCLUIDO").length}
          tone="destructive"
        />
        <StatCard label="Abertos" value={all.filter((f) => f.status !== "CONCLUIDO").length} />
        <StatCard
          label="Concluídos"
          value={all.filter((f) => f.status === "CONCLUIDO").length}
          tone="primary"
        />
      </div>

      <Select value={filter} onValueChange={setFilter}>
        <SelectTrigger className="w-52">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {["ABERTOS", "HOJE", "ATRASADOS", "CONCLUIDOS", "TODOS"].map((f) => (
            <SelectItem key={f} value={f}>
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {rows.isLoading ? (
        <LoadingRows />
      ) : list.length === 0 ? (
        <EmptyState title="Nenhum follow-up nesta visão" />
      ) : (
        <ul className="surface-panel divide-y divide-border">
          {list.map((f) => (
            <li key={f.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  Follow-up {f.number ?? "—"} ·{" "}
                  {f.lead_id ? (
                    <Link to="/leads/$id" params={{ id: f.lead_id }} className="hover:text-primary">
                      {leadName(f.lead_id)}
                    </Link>
                  ) : (
                    leadName(f.lead_id)
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {[f.next_action, f.channel].filter(Boolean).join(" · ") || "—"}
                </p>
              </div>
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
                  onClick={() => save.mutate({ id: f.id, status: "CONCLUIDO" })}
                >
                  Concluir
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
