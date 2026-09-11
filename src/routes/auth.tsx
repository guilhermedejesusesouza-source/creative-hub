import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    // If no session, you could choose a different page; here we always go to dashboard
    throw redirect({ to: "/dashboard" });
  },
  component: () => null,
});
