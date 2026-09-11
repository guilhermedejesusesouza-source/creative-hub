import { Link, createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState, ErrorState, LoadingRows, PageHeader, Tag } from "@/components/ui-kit";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { CLIENT_STATUSES, HEALTH_STATUSES, LEAD_SOURCES, labelFrom, toneFrom } from "@/lib/crm";
import { useRows, useSaveRow } from "@/lib/data";
import { brl, dateBR } from "@/lib/domain";

export const Route = createFileRoute("/_authenticated/clientes/")({
  head: () => ({
    meta: [
      { title: "Clientes — Creative OS" },
      {
        name: "description",
        content:
          "Carteira de clientes com status, saúde, valor mensal, responsável e próximas ações.",
      },
      { property: "og:title", content: "Clientes — Creative OS" },
      { property: "og:description", content: "Gestão completa da carteira de clientes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClientsPage,
});

export type ClientRow = {
  id: string;
  name: string;
  company: string | null;
  status: string;
  health: string;
  service: string | null;
  segment: string | null;
  monthly_value: number | null;
  account_manager: string | null;
  priority: string;
  is_demo: boolean;
  updated_at: string;
};

function ClientsPage() {
  const { workspaceId } = useAuth();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("TODOS");
  const [health, setHealth] = useState("TODOS");
  const clients = useRows<ClientRow>("clients", workspaceId, { orderBy: "name", ascending: true });

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (clients.data ?? []).filter((c) => {
      if (status !== "TODOS" && c.status !== status) return false;
      if (health !== "TODOS" && c.health !== health) return false;
      if (!term) return true;
      return `${c.name} ${c.company ?? ""} ${c.segment ?? ""}`.toLowerCase().includes(term);
    });
  }, [clients.data, q, status, health]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Clientes"
        description={`${rows.length} de ${(clients.data ?? []).length} clientes na carteira.`}
        actions={<NewClientDialog />}
      />

      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Buscar por nome, empresa ou segmento"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos os status</SelectItem>
            {CLIENT_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={health} onValueChange={setHealth}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Saúde" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Toda saúde</SelectItem>
            {HEALTH_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {clients.isLoading ? (
        <LoadingRows />
      ) : clients.isError ? (
        <ErrorState />
      ) : rows.length === 0 ? (
        <EmptyState
          title="Nenhum cliente encontrado"
          description="Ajuste os filtros ou cadastre um novo cliente."
          action={<NewClientDialog />}
        />
      ) : (
        <div className="surface-panel overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Valor mensal</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Saúde</TableHead>
                <TableHead>Atualizado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((c) => (
                <TableRow key={c.id} className="cursor-pointer">
                  <TableCell>
                    <Link to="/clientes/$id" params={{ id: c.id }} className="block">
                      <span className="font-medium">{c.name}</span>
                      {c.company ? (
                        <span className="block text-xs text-muted-foreground">{c.company}</span>
                      ) : null}
                      {c.is_demo ? (
                        <Tag tone="info" className="mt-1">
                          demo
                        </Tag>
                      ) : null}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Tag tone={toneFrom(CLIENT_STATUSES, c.status)}>
                      {labelFrom(CLIENT_STATUSES, c.status)}
                    </Tag>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {c.service ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm">{brl(c.monthly_value ?? 0)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {c.account_manager ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Tag tone={toneFrom(HEALTH_STATUSES, c.health)}>
                      {labelFrom(HEALTH_STATUSES, c.health)}
                    </Tag>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {dateBR(c.updated_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export function NewClientDialog() {
  const { workspaceId } = useAuth();
  const [open, setOpen] = useState(false);
  const save = useSaveRow("clients", { success: "Cliente cadastrado" });
  const [form, setForm] = useState({
    name: "",
    company: "",
    segment: "",
    service: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    monthly_value: "",
    account_manager: "",
    status: "PROSPECT",
    source: "Indicação",
    notes: "",
  });

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    await save.mutateAsync({
      workspace_id: workspaceId,
      name: form.name.trim(),
      company: form.company || null,
      segment: form.segment || null,
      service: form.service || null,
      contact_name: form.contact_name || null,
      contact_email: form.contact_email || null,
      contact_phone: form.contact_phone || null,
      monthly_value: form.monthly_value ? Number(form.monthly_value) : null,
      account_manager: form.account_manager || null,
      status: form.status,
      source: form.source,
      notes: form.notes || null,
      entry_date: new Date().toISOString().slice(0, 10),
    });
    setOpen(false);
    setForm({ ...form, name: "", company: "", notes: "" });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1.5 size-4" /> Novo cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo cliente</DialogTitle>
        </DialogHeader>
        <form className="space-y-3" onSubmit={submit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="c-name">Nome *</Label>
              <Input
                id="c-name"
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-company">Empresa</Label>
              <Input
                id="c-company"
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-segment">Segmento</Label>
              <Input
                id="c-segment"
                value={form.segment}
                onChange={(e) => set("segment", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-service">Serviço</Label>
              <Input
                id="c-service"
                value={form.service}
                onChange={(e) => set("service", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-value">Valor mensal (R$)</Label>
              <Input
                id="c-value"
                type="number"
                min="0"
                step="50"
                value={form.monthly_value}
                onChange={(e) => set("monthly_value", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-contact">Contato</Label>
              <Input
                id="c-contact"
                value={form.contact_name}
                onChange={(e) => set("contact_name", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-phone">Telefone</Label>
              <Input
                id="c-phone"
                value={form.contact_phone}
                onChange={(e) => set("contact_phone", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-email">E-mail</Label>
              <Input
                id="c-email"
                type="email"
                value={form.contact_email}
                onChange={(e) => set("contact_email", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-owner">Responsável</Label>
              <Input
                id="c-owner"
                value={form.account_manager}
                onChange={(e) => set("account_manager", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLIENT_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Origem</Label>
              <Select value={form.source} onValueChange={(v) => set("source", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_SOURCES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-notes">Observações</Label>
            <Textarea
              id="c-notes"
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? "Salvando…" : "Cadastrar cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
