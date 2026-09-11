import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Brain,
  Building2,
  CheckSquare,
  ClipboardList,
  FileText,
  Kanban,
  LayoutDashboard,
  Library,
  LogOut,
  Menu,
  Search,
  Settings,
  Sparkles,
  Target,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tag } from "@/components/ui-kit";
import { useAuth } from "@/hooks/useAuth";
import { useRows } from "@/lib/data";
import { dateBR } from "@/lib/domain";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: typeof Users };

const NAV: { group: string; items: NavItem[] }[] = [
  {
    group: "Visão geral",
    items: [{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    group: "CRM",
    items: [
      { to: "/clientes", label: "Clientes", icon: Building2 },
      { to: "/leads", label: "Leads & Pipeline", icon: Target },
      { to: "/follow-ups", label: "Follow-ups", icon: ClipboardList },
    ],
  },
  {
    group: "Operação",
    items: [
      { to: "/tarefas", label: "Tarefas", icon: CheckSquare },
      { to: "/projetos", label: "Projetos", icon: FileText },
      { to: "/producao", label: "Production Board", icon: Kanban },
    ],
  },
  {
    group: "Creative OS",
    items: [
      { to: "/criativos", label: "Criativos", icon: Sparkles },
      { to: "/biblioteca", label: "Biblioteca criativa", icon: Library },
    ],
  },
  {
    group: "Intelligence",
    items: [
      { to: "/performance", label: "Performance", icon: BarChart3 },
      { to: "/insights", label: "Insights & Diagnósticos", icon: Brain },
    ],
  },
  {
    group: "Sistema",
    items: [{ to: "/configuracoes", label: "Configurações", icon: Settings }],
  },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { workspaceName, user, role } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearch((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 shrink-0 overflow-y-auto border-r border-sidebar-border bg-sidebar px-3 py-4 transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-2 pb-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            <span className="font-display text-sm font-semibold">Creative OS</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </div>

        <nav className="space-y-5">
          {NAV.map((group) => (
            <div key={group.group}>
              <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.group}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname.startsWith(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                        active
                          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <item.icon className="size-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {open ? (
        <button
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/85 px-3 backdrop-blur sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Abrir menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-4" />
          </Button>
          <button
            onClick={() => setSearch(true)}
            className="flex h-9 flex-1 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:border-primary/40 sm:max-w-sm"
          >
            <Search className="size-4" />
            <span className="truncate">Buscar…</span>
            <kbd className="ml-auto hidden rounded border border-border px-1.5 text-[10px] sm:block">
              ⌘K
            </kbd>
          </button>
          <div className="ml-auto flex items-center gap-1">
            <NotificationsButton />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="max-w-[9rem] truncate">
                  {workspaceName}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-64">
                <p className="text-sm font-medium">{user?.email}</p>
                <p className="mt-1 text-xs text-muted-foreground">Papel: {role ?? "—"}</p>
                <Button variant="outline" size="sm" className="mt-3 w-full" onClick={signOut}>
                  <LogOut className="mr-2 size-3.5" /> Sair
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6 sm:px-6">{children}</main>
      </div>

      <GlobalSearch open={search} onOpenChange={setSearch} />
    </div>
  );
}

function NotificationsButton() {
  const { workspaceId } = useAuth();
  const { data = [] } = useRows<{
    id: string;
    title: string;
    body: string | null;
    created_at: string;
  }>("notifications", workspaceId, { limit: 12 });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Notificações" className="relative">
          <Bell className="size-4" />
          {data.length > 0 ? (
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-neon" />
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <p className="border-b border-border px-4 py-3 text-sm font-medium">Notificações</p>
        <div className="max-h-80 overflow-y-auto">
          {data.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground">Nada por aqui ainda.</p>
          ) : (
            data.map((n) => (
              <div key={n.id} className="border-b border-border px-4 py-3 last:border-0">
                <p className="text-sm font-medium">{n.title}</p>
                {n.body ? <p className="text-xs text-muted-foreground">{n.body}</p> : null}
                <p className="mt-1 text-[11px] text-muted-foreground">{dateBR(n.created_at)}</p>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function GlobalSearch({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { workspaceId } = useAuth();
  const navigate = useNavigate();
  const clients = useRows<{ id: string; name: string; company: string | null }>(
    "clients",
    workspaceId,
    { orderBy: "name", ascending: true, enabled: open },
  );
  const leads = useRows<{ id: string; name: string; company: string | null }>(
    "leads",
    workspaceId,
    {
      orderBy: "name",
      ascending: true,
      enabled: open,
    },
  );
  const creatives = useRows<{ id: string; name: string; code: string | null }>(
    "creatives",
    workspaceId,
    { enabled: open, limit: 50 },
  );

  function go(to: string, params?: Record<string, string>) {
    onOpenChange(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigate({ to, params } as any);
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar clientes, leads, criativos e páginas…" />
      <CommandList>
        <CommandEmpty>Nada encontrado.</CommandEmpty>
        <CommandGroup heading="Páginas">
          {NAV.flatMap((g) => g.items).map((item) => (
            <CommandItem key={item.to} value={item.label} onSelect={() => go(item.to)}>
              <item.icon className="mr-2 size-4" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Clientes">
          {(clients.data ?? []).slice(0, 8).map((c) => (
            <CommandItem
              key={c.id}
              value={`cliente ${c.name} ${c.company ?? ""}`}
              onSelect={() => go("/clientes/$id", { id: c.id })}
            >
              <Building2 className="mr-2 size-4" />
              {c.name}
              {c.company ? (
                <span className="ml-2 text-xs text-muted-foreground">{c.company}</span>
              ) : null}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Leads">
          {(leads.data ?? []).slice(0, 8).map((l) => (
            <CommandItem
              key={l.id}
              value={`lead ${l.name} ${l.company ?? ""}`}
              onSelect={() => go("/leads/$id", { id: l.id })}
            >
              <Target className="mr-2 size-4" />
              {l.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Criativos">
          {(creatives.data ?? []).slice(0, 8).map((c) => (
            <CommandItem
              key={c.id}
              value={`criativo ${c.code ?? ""} ${c.name}`}
              onSelect={() => go("/criativos/$id", { id: c.id })}
            >
              <Sparkles className="mr-2 size-4" />
              <span className="text-muted-foreground">{c.code}</span>
              <span className="ml-2">{c.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
      <div className="flex items-center gap-2 border-t border-border px-3 py-2">
        <Tag tone="primary">⌘K</Tag>
        <span className="text-xs text-muted-foreground">busca global</span>
      </div>
    </CommandDialog>
  );
}
