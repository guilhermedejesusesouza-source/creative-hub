import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { LoadingRows } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { loading, workspaceId } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-3 p-8">
        <LoadingRows rows={6} />
      </div>
    );
  }

  if (!workspaceId) return <Onboarding />;

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

function Onboarding() {
  const { refresh, user } = useAuth();
  const [name, setName] = useState("Minha agência");
  const [withDemo, setWithDemo] = useState(true);
  const [busy, setBusy] = useState(false);

  async function create() {
    setBusy(true);
    const { error } = await supabase.rpc("create_workspace_with_demo", {
      _name: name,
      _with_demo: withDemo,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Workspace criado!");
    refresh();
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background bg-grid-faint px-4 py-10">
      <div className="surface-panel w-full max-w-lg p-7">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Primeiros passos
        </p>
        <h1 className="mt-3 text-2xl font-semibold">Vamos criar o seu workspace</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Olá {user?.email}. Tudo no Creative OS fica isolado por workspace: clientes, leads,
          projetos, criativos e resultados.
        </p>

        <div className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ws">Nome do workspace</Label>
            <Input id="ws" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">Incluir dados de demonstração</p>
              <p className="text-xs text-muted-foreground">
                2 clientes, 3 projetos, criativos, ângulos, hooks, copies, performance e insights —
                todos marcados como demo.
              </p>
            </div>
            <Switch checked={withDemo} onCheckedChange={setWithDemo} aria-label="Dados demo" />
          </div>
          <Button className="w-full" onClick={create} disabled={busy || !name.trim()}>
            {busy ? "Criando…" : "Criar workspace"}
          </Button>
        </div>
      </div>
    </div>
  );
}
