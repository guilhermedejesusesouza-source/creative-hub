import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { EmptyState, LoadingRows, PageHeader, Tag } from "@/components/ui-kit";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useRows, useSaveRow } from "@/lib/data";
import { CREATIVE_STATUSES, STATUS_LABELS, dateBR } from "@/lib/domain";

export const Route = createFileRoute("/_authenticated/producao")({
  head: () => ({
    meta: [
      { title: "Production Board — Creative OS" },
      { name: "description", content: "Kanban de produção criativa do backlog à iteração, com arrastar e soltar." },
      { property: "og:title", content: "Production Board — Creative OS" },
      { property: "og:description", content: "Acompanhe a produção criativa em Kanban." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductionBoard;
});

type Creative = {
  id: string;
  code: string | null;
  name: string;
  status: string;
  client_id: string | null;
  format: string | null;
  owner: string | null;
  priority: string | null;
  due_on: string | null;
};

function ProductionBoard() {
  const { workspaceId } = useAuth();
  const creatives = useRows<Creative>("creatives", workspaceId, { orderBy: "created_at" });
  const clients = useRows<{ id: string; name: string }>("clients", workspaceId, {
    orderBy: "name",
    ascending: true,
  });
  const save = useSaveRow("creatives", { success: "Status atualizado" });
  const [client, setClient] = useState("TODOS");
  const [owner, setOwner] = useState("TODOS");

  const owners = useMemo(
    () => [...new Set((creatives.data ?? []).map((c) => c.owner).filter(Boolean))] as string[],
    [creatives.data],
  );
  const list = (creatives.data ?? []).filter(
    (c) =>
      (client === "TODOS" || c.client_id === client) && (owner === "TODOS" || c.owner === owner),
  );
  const clientName = (id: string | null) => (clients.data ?? []).find((c) => c.id === id)?.name ?? "—";

  return (
    <div className="space-y-5">
      <PageHeader
        title="Production Board"
        description="Arraste os cards entre as etapas para atualizar o status do criativo."
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
        <Select value={owner} onValueChange={setOwner}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Responsável" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos os responsáveis</SelectItem>
            {owners.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {creatives.isLoading ? (
        <LoadingRows />
      ) : list.length === 0 ? (
        <EmptyState title="Nenhum criativo no board" description="Crie criativos para vê-los aqui." />
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-3">
          {CREATIVE_STATUSES.map((status) => {
            const items = list.filter((c) => c.status === status);
            return (
              <div key={status} className="w-64 shrink-0">
                <div className="surface-panel px-3 py-2">
                  <p className="text-xs font-semibold">{STATUS_LABELS[status]}</p>
                  <p className="text-[11px] text-muted-foreground">{items.length} criativo(s)</p>
                </div>
                <div
                  className="mt-2 min-h-24 space-y-2 rounded-lg border border-dashed border-border p-2"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    const cid = e.dataTransfer.getData("text/plain");
                    if (cid) save.mutate({ id: cid, status });
                  }}
                >
                  {items.map((c) => (
                    <Link
                      key={c.id}
                      to="/criativos/$id"
                      params={{ id: c.id }}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("text/plain", c.id)}
                      className="block rounded-md border border-border bg-card p-2.5 hover:border-primary/60"
                    >
                      <p className="text-[11px] text-muted-foreground">{c.code}</p>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-[11px] text-muted-foreground">{clientName(c.client_id)}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <Tag tone={c.priority === "URGENTE" ? "destructive" : "muted"}>
                          {c.priority ?? "—"}
                        </Tag>
                        <span className="text-[11px] text-muted-foreground">{dateBR(c.due_on)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
