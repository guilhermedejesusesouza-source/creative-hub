import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { DemoTag, EmptyState, LoadingRows, PageHeader, Tag } from "@/components/ui-kit";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useRows } from "@/lib/data";
import { STATUS_LABELS, dateBR, type CreativeStatus } from "@/lib/domain";

export const Route = createFileRoute("/_authenticated/biblioteca")({
  head: () => ({
    meta: [
      { title: "Biblioteca criativa — Creative OS" },
      { name: "description", content: "Criativos publicados e em produção, ângulos, hooks e copies reutilizáveis." },
      { property: "og:title", content: "Biblioteca criativa — Creative OS" },
      { property: "og:description", content: "Reaproveite o que já funcionou." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const { workspaceId } = useAuth();
  const creatives = useRows<{
    id: string;
    code: string | null;
    name: string;
    status: string;
    platform: string | null;
    format: string | null;
    thumbnail_url: string | null;
    is_demo: boolean | null;
  }>("creatives", workspaceId, { orderBy: "created_at" });
  const angles = useRows<{ id: string; name: string; category: string | null; description: string | null; when_to_use: string | null }>(
    "angles",
    workspaceId,
    { orderBy: "name", ascending: true },
  );
  const hooks = useRows<{ id: string; text: string; category: string | null; is_favorite: boolean | null }>(
    "hooks",
    workspaceId,
    { orderBy: "created_at" },
  );
  const copies = useRows<{
    id: string;
    headline: string | null;
    primary_text: string | null;
    cta: string | null;
    funnel: string | null;
    created_at: string;
  }>("copy_items", workspaceId, { orderBy: "created_at" });
  const assets = useRows<{ id: string; name: string; type: string | null; url: string | null; created_at: string }>(
    "assets",
    workspaceId,
    { orderBy: "created_at" },
  );

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("TODOS");

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return (creatives.data ?? []).filter(
      (c) =>
        (!t || `${c.name} ${c.code ?? ""}`.toLowerCase().includes(t)) &&
        (status === "TODOS" || c.status === status),
    );
  }, [creatives.data, q, status]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Biblioteca criativa"
        description="Tudo que já foi produzido, mais os ângulos, hooks, copies e materiais reutilizáveis."
      />

      <Tabs defaultValue="criativos">
        <TabsList className="flex-wrap">
          <TabsTrigger value="criativos">Criativos</TabsTrigger>
          <TabsTrigger value="angulos">Ângulos</TabsTrigger>
          <TabsTrigger value="hooks">Hooks</TabsTrigger>
          <TabsTrigger value="copies">Copies</TabsTrigger>
          <TabsTrigger value="assets">Materiais</TabsTrigger>
        </TabsList>

        <TabsContent value="criativos" className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Input
              placeholder="Buscar criativo"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="max-w-xs"
            />
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODOS">Todos os status</SelectItem>
                <SelectItem value="PUBLICADO">Publicado</SelectItem>
                <SelectItem value="APROVADO">Aprovado</SelectItem>
                <SelectItem value="PRODUCAO">Produção</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {creatives.isLoading ? (
            <LoadingRows />
          ) : shown.length === 0 ? (
            <EmptyState title="Nada na biblioteca ainda" />
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {shown.map((c) => (
                <li key={c.id} className="surface-panel overflow-hidden">
                  <div className="flex aspect-video items-center justify-center bg-muted/40">
                    {c.thumbnail_url ? (
                      <img src={c.thumbnail_url} alt={c.name} className="size-full object-cover" loading="lazy" />
                    ) : (
                      <span className="text-xs text-muted-foreground">Sem prévia</span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-[11px] text-muted-foreground">{c.code}</p>
                    <Link to="/criativos/$id" params={{ id: c.id }} className="text-sm font-medium hover:text-primary">
                      {c.name}
                    </Link>
                    {c.is_demo ? <DemoTag /> : null}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Tag>{STATUS_LABELS[c.status as CreativeStatus] ?? c.status}</Tag>
                      {c.platform ? <Tag tone="muted">{c.platform}</Tag> : null}
                      {c.format ? <Tag tone="muted">{c.format}</Tag> : null}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="angulos">
          {(angles.data ?? []).length === 0 ? (
            <EmptyState title="Nenhum ângulo cadastrado" />
          ) : (
            <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {(angles.data ?? []).map((a) => (
                <li key={a.id} className="surface-panel p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold">{a.name}</p>
                    {a.category ? <Tag>{a.category}</Tag> : null}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{a.description ?? "—"}</p>
                  {a.when_to_use ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      <span className="text-foreground">Quando usar: </span>
                      {a.when_to_use}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="hooks">
          {(hooks.data ?? []).length === 0 ? (
            <EmptyState title="Nenhum hook cadastrado" />
          ) : (
            <ul className="surface-panel divide-y divide-border">
              {(hooks.data ?? []).map((h) => (
                <li key={h.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <p className="text-sm">{h.text}</p>
                  {h.category ? <Tag>{h.category}</Tag> : null}
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="copies">
          {(copies.data ?? []).length === 0 ? (
            <EmptyState title="Nenhuma copy cadastrada" />
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {(copies.data ?? []).map((c) => (
                <li key={c.id} className="surface-panel p-4">
                  <p className="text-sm font-semibold">{c.headline ?? "Sem headline"}</p>
                  <p className="mt-1.5 whitespace-pre-wrap text-sm text-muted-foreground">
                    {c.primary_text ?? "—"}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    {c.cta ? <Tag tone="primary">{c.cta}</Tag> : null}
                    {c.funnel ? <Tag>{c.funnel}</Tag> : null}
                    <span className="text-[11px] text-muted-foreground">{dateBR(c.created_at)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="assets">
          {(assets.data ?? []).length === 0 ? (
            <EmptyState title="Nenhum material cadastrado" />
          ) : (
            <ul className="surface-panel divide-y divide-border">
              {(assets.data ?? []).map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div>
                    <p className="text-sm">{a.name}</p>
                    <p className="text-[11px] text-muted-foreground">{a.type ?? "—"}</p>
                  </div>
                  {a.url ? (
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      Abrir
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
