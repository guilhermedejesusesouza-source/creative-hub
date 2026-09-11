import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";

import { EmptyState, LoadingRows, PageHeader, Tag } from "@/components/ui-kit";
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
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useRows, useSaveRow } from "@/lib/data";
import { FUNNEL_STAGES, PLATFORMS, dateBR } from "@/lib/domain";

export const Route = createFileRoute("/_authenticated/projetos")({
  head: () => ({
    meta: [
      { title: "Projetos — Creative OS" },
      { name: "description", content: "Projetos por cliente com objetivo, plataforma, funil, período e responsáveis." },
      { property: "og:title", content: "Projetos — Creative OS" },
      { property: "og:description", content: "Organize os projetos de cada cliente." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectsPage,
});

type Project = {
  id: string;
  name: string;
  status: string | null;
  objective: string | null;
  platform: string | null;
  funnel: string | null;
  starts_on: string | null;
  ends_on: string | null;
  client_id: string | null;
  owner: string | null;
};

function ProjectsPage() {
  const { workspaceId } = useAuth();
  const projects = useRows<Project>("projects", workspaceId, { orderBy: "created_at" });
  const clients = useRows<{ id: string; name: string }>("clients", workspaceId, {
    orderBy: "name",
    ascending: true,
  });
  const clientName = (id: string | null) => (clients.data ?? []).find((c) => c.id === id)?.name ?? "—";

  return (
    <div className="space-y-5">
      <PageHeader
        title="Projetos"
        description="Cada projeto conecta cliente, oferta, plataforma e criativos."
        actions={<NewProjectDialog clients={clients.data ?? []} />}
      />

      {projects.isLoading ? (
        <LoadingRows />
      ) : (projects.data ?? []).length === 0 ? (
        <EmptyState title="Nenhum projeto ainda" description="Crie o primeiro projeto para um cliente." />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {(projects.data ?? []).map((p) => (
            <li key={p.id} className="surface-panel p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{clientName(p.client_id)}</p>
                </div>
                <Tag>{p.status ?? "—"}</Tag>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{p.objective ?? "Sem objetivo definido."}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                {p.platform ? <Tag>{p.platform}</Tag> : null}
                {p.funnel ? <Tag>{p.funnel}</Tag> : null}
                <span>
                  {dateBR(p.starts_on)} — {dateBR(p.ends_on)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function NewProjectDialog({ clients }: { clients: { id: string; name: string }[] }) {
  const { workspaceId, user } = useAuth();
  const save = useSaveRow("projects", { success: "Projeto criado" });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    client_id: "",
    objective: "",
    platform: "Meta",
    funnel: "TOFU",
    starts_on: "",
    ends_on: "",
  });

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.client_id) return;
    await save.mutateAsync({
      workspace_id: workspaceId,
      name: form.name.trim(),
      client_id: form.client_id,
      objective: form.objective || null,
      platform: form.platform,
      funnel: form.funnel,
      starts_on: form.starts_on || null,
      ends_on: form.ends_on || null,
      status: "ATIVO",
      owner: user?.email ?? null,
    });
    setOpen(false);
    setForm({ ...form, name: "", objective: "" });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1.5 size-4" /> Novo projeto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo projeto</DialogTitle>
        </DialogHeader>
        <form className="space-y-3" onSubmit={submit}>
          <div className="space-y-1.5">
            <Label htmlFor="p-name">Nome *</Label>
            <Input id="p-name" required value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Cliente *</Label>
              <Select value={form.client_id} onValueChange={(v) => set("client_id", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
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
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Funil</Label>
              <Select value={form.funnel} onValueChange={(v) => set("funnel", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FUNNEL_STAGES.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-start">Início</Label>
              <Input id="p-start" type="date" value={form.starts_on} onChange={(e) => set("starts_on", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-end">Fim</Label>
              <Input id="p-end" type="date" value={form.ends_on} onChange={(e) => set("ends_on", e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-obj">Objetivo</Label>
            <Textarea id="p-obj" value={form.objective} onChange={(e) => set("objective", e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={save.isPending}>
              Criar projeto
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
