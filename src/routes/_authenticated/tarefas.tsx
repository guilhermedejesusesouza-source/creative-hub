import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState, LoadingRows, PageHeader, StatCard, Tag } from "@/components/ui-kit";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import {
  RECURRENCES,
  TASK_STATUSES,
  TASK_TYPES,
  isOverdue,
  isToday,
  labelFrom,
  toneFrom,
} from "@/lib/crm";
import { useRows, useSaveRow } from "@/lib/data";
import { PRIORITIES, dateBR } from "@/lib/domain";

export const Route = createFileRoute("/_authenticated/tarefas")({
  head: () => ({
    meta: [
      { title: "Tarefas — Creative OS" },
      {
        name: "description",
        content: "Central de tarefas: hoje, atrasadas, semana e concluídas, com recorrência.",
      },
      { property: "og:title", content: "Tarefas — Creative OS" },
      { property: "og:description", content: "Central operacional de tarefas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TasksPage,
});

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  type: string;
  priority: string;
  due_on: string | null;
  owner: string | null;
  client_id: string | null;
  recurrence: string;
};

function TasksPage() {
  const { workspaceId } = useAuth();
  const tasks = useRows<Task>("tasks", workspaceId, { orderBy: "due_on", ascending: true });
  const clients = useRows<{ id: string; name: string }>("clients", workspaceId, {
    orderBy: "name",
    ascending: true,
  });
  const save = useSaveRow("tasks", { success: "Tarefa atualizada" });
  const [clientFilter, setClientFilter] = useState("TODOS");

  const all = useMemo(
    () =>
      (tasks.data ?? []).filter((t) => clientFilter === "TODOS" || t.client_id === clientFilter),
    [tasks.data, clientFilter],
  );
  const open = all.filter((t) => t.status !== "CONCLUIDA" && t.status !== "CANCELADA");
  const groups = {
    hoje: open.filter((t) => isToday(t.due_on)),
    atrasadas: open.filter((t) => isOverdue(t.due_on)),
    proximas: open.filter((t) => t.due_on && t.due_on > new Date().toISOString().slice(0, 10)),
    todas: all,
    concluidas: all.filter((t) => t.status === "CONCLUIDA"),
  };

  const clientName = (cid: string | null) =>
    (clients.data ?? []).find((c) => c.id === cid)?.name ?? null;

  function TaskList({ items }: { items: Task[] }) {
    if (items.length === 0) return <EmptyState title="Nada por aqui" />;
    return (
      <ul className="surface-panel divide-y divide-border">
        {items.map((t) => (
          <li key={t.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <input
              type="checkbox"
              aria-label={`Concluir ${t.title}`}
              checked={t.status === "CONCLUIDA"}
              onChange={(e) =>
                save.mutate({
                  id: t.id,
                  status: e.target.checked ? "CONCLUIDA" : "PENDENTE",
                  done_at: e.target.checked ? new Date().toISOString() : null,
                })
              }
              className="size-4 accent-[var(--primary)]"
            />
            <div className="min-w-0 flex-1">
              <p
                className={`text-sm ${t.status === "CONCLUIDA" ? "line-through text-muted-foreground" : ""}`}
              >
                {t.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {[clientName(t.client_id), labelFrom(TASK_TYPES, t.type), t.owner]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
            {t.recurrence && t.recurrence !== "NENHUMA" ? (
              <Tag tone="info">{labelFrom(RECURRENCES, t.recurrence)}</Tag>
            ) : null}
            <Tag tone={t.priority === "urgente" ? "destructive" : "muted"}>{t.priority}</Tag>
            <span className="text-xs text-muted-foreground">{dateBR(t.due_on)}</span>
            <Tag
              tone={
                isOverdue(t.due_on) && t.status !== "CONCLUIDA"
                  ? "destructive"
                  : toneFrom(TASK_STATUSES, t.status)
              }
            >
              {isOverdue(t.due_on) && t.status !== "CONCLUIDA"
                ? "Atrasada"
                : labelFrom(TASK_STATUSES, t.status)}
            </Tag>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Tarefas"
        description="Tudo que precisa de ação, com prazo, responsável e recorrência."
        actions={<NewTaskDialog clients={clients.data ?? []} />}
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard label="Hoje" value={groups.hoje.length} />
        <StatCard label="Atrasadas" value={groups.atrasadas.length} tone="destructive" />
        <StatCard label="Próximas" value={groups.proximas.length} />
        <StatCard label="Concluídas" value={groups.concluidas.length} tone="primary" />
      </div>

      <Select value={clientFilter} onValueChange={setClientFilter}>
        <SelectTrigger className="w-56">
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

      {tasks.isLoading ? (
        <LoadingRows />
      ) : (
        <Tabs defaultValue="hoje">
          <TabsList className="flex-wrap">
            <TabsTrigger value="hoje">Hoje</TabsTrigger>
            <TabsTrigger value="atrasadas">Atrasadas</TabsTrigger>
            <TabsTrigger value="proximas">Próximas</TabsTrigger>
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="concluidas">Concluídas</TabsTrigger>
          </TabsList>
          <TabsContent value="hoje">
            <TaskList items={groups.hoje} />
          </TabsContent>
          <TabsContent value="atrasadas">
            <TaskList items={groups.atrasadas} />
          </TabsContent>
          <TabsContent value="proximas">
            <TaskList items={groups.proximas} />
          </TabsContent>
          <TabsContent value="todas">
            <TaskList items={groups.todas} />
          </TabsContent>
          <TabsContent value="concluidas">
            <TaskList items={groups.concluidas} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function NewTaskDialog({ clients }: { clients: { id: string; name: string }[] }) {
  const { workspaceId, user } = useAuth();
  const save = useSaveRow("tasks", { success: "Tarefa criada" });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "OPERACIONAL",
    priority: "media",
    due_on: new Date().toISOString().slice(0, 10),
    client_id: "",
    recurrence: "NENHUMA",
  });

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    await save.mutateAsync({
      workspace_id: workspaceId,
      title: form.title.trim(),
      description: form.description || null,
      type: form.type,
      priority: form.priority,
      due_on: form.due_on || null,
      client_id: form.client_id || null,
      recurrence: form.recurrence,
      status: "PENDENTE",
      owner: user?.email ?? null,
    });
    setOpen(false);
    setForm({ ...form, title: "", description: "" });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1.5 size-4" /> Nova tarefa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova tarefa</DialogTitle>
        </DialogHeader>
        <form className="space-y-3" onSubmit={submit}>
          <div className="space-y-1.5">
            <Label htmlFor="t-title">Título *</Label>
            <Input
              id="t-title"
              required
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="t-due">Prazo</Label>
              <Input
                id="t-due"
                type="date"
                value={form.due_on}
                onChange={(e) => set("due_on", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Cliente</Label>
              <Select value={form.client_id} onValueChange={(v) => set("client_id", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sem cliente" />
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
              <Label>Tipo</Label>
              <Select value={form.type} onValueChange={(v) => set("type", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Prioridade</Label>
              <Select value={form.priority} onValueChange={(v) => set("priority", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Recorrência</Label>
              <Select value={form.recurrence} onValueChange={(v) => set("recurrence", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RECURRENCES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="t-desc">Descrição</Label>
            <Textarea
              id="t-desc"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={save.isPending}>
              Criar tarefa
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
