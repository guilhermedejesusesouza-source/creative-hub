import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const handleLogin = async () => {
    if (!email) return toast.error("Informe o e‑mail.");
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // After clicking link in email, Supabase will redirect here
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) toast.error(error.message);
    else toast.success("Link de acesso enviado ao e‑mail.");
    setBusy(false);
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background bg-grid-faint px-4 py-10">
      <div className="surface-panel w-full max-w-sm p-6">
        <h1 className="mb-4 text-2xl font-semibold">Entrar</h1>
        <Label htmlFor="email" className="mb-1 block text-sm font-medium">
          E‑mail
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4"
        />
        <Button onClick={handleLogin} disabled={busy} className="w-full">
          {busy ? "Enviando…" : "Enviar link de acesso"}
        </Button>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/auth")({
  component: LoginPage,
});
