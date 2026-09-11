import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Entrar no Creative OS" },
      { name: "description", content: "Acesse sua conta do Creative OS para gerenciar clientes, leads e criativos." },
      { property: "og:title", content: "Entrar no Creative OS" },
      { property: "og:description", content: "Acesse sua conta do Creative OS." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"entrar" | "criar" | "recuperar">("entrar");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate({ to: "/dashboard", replace: true });
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (data.session) {
      toast.success("Conta criada e autenticada com sucesso!");
      navigate({ to: "/dashboard", replace: true });
    } else {
      toast.success(
        "Conta criada! Verifique seu e-mail para confirmar o cadastro antes de entrar.",
        { duration: 6000 }
      );
      setMode("entrar");
    }
  }

  async function resetPassword(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Instruções de recuperação enviadas para o seu e-mail!");
    setMode("entrar");
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background bg-grid-faint px-4 py-10">
      <div className="w-full max-w-md">
        <h1 className="text-center font-display text-2xl font-semibold">Creative OS</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Entre para acessar o CRM e a operação de criativos.
        </p>

        <div className="surface-panel mt-6 p-6">
          <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
            <TabsList className="w-full">
              <TabsTrigger value="entrar" className="flex-1">
                Entrar
              </TabsTrigger>
              <TabsTrigger value="criar" className="flex-1">
                Criar conta
              </TabsTrigger>
              <TabsTrigger value="recuperar" className="flex-1">
                Recuperar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="entrar">
              <form className="space-y-4" onSubmit={signIn}>
                <div className="space-y-1.5">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <button
                      type="button"
                      onClick={() => setMode("recuperar")}
                      className="text-xs text-primary hover:underline"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Entrando…" : "Entrar"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="criar">
              <form className="space-y-4" onSubmit={signUp}>
                <div className="space-y-1.5">
                  <Label htmlFor="name">Seu nome</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email2">E-mail</Label>
                  <Input
                    id="email2"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password2">Senha</Label>
                  <Input
                    id="password2"
                    type="password"
                    minLength={6}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Criando…" : "Criar conta"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="recuperar">
              <form className="space-y-4" onSubmit={resetPassword}>
                <p className="text-xs text-muted-foreground">
                  Digite seu e-mail cadastrado para receber um link de redefinição de senha.
                </p>
                <div className="space-y-1.5">
                  <Label htmlFor="email-recuperar">E-mail</Label>
                  <Input
                    id="email-recuperar"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Enviando link…" : "Enviar link de recuperação"}
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setMode("entrar")}
                    className="text-xs text-muted-foreground hover:underline"
                  >
                    Voltar para o login
                  </button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
