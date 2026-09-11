import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { supabase } from "@/integrations/supabase/client";

export type Membership = {
  workspace_id: string;
  role: string;
  workspaces: { id: string; name: string } | null;
};

type AuthValue = {
  loading: boolean;
  session: Session | null;
  user: User | null;
  memberships: Membership[];
  workspaceId: string | null;
  workspaceName: string;
  role: string | null;
  setWorkspaceId: (id: string) => void;
  refresh: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);
const STORAGE_KEY = "creative-os:workspace";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(
    typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null,
  );
  const qc = useQueryClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSession(data.session);
      } else {
        // No session, user must authenticate via email magic link
        setSession(null);
      }
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next ?? null);
      if (event === "SIGNED_OUT") qc.clear();
    });
    return () => sub.subscription.unsubscribe();
  }, [qc]);

  const membershipsQuery = useQuery<Membership[]>({
    queryKey: ["memberships", session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workspace_members")
        .select("workspace_id, role, workspaces(id, name)")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as Membership[];
    },
  });

  const memberships = membershipsQuery.data ?? [];
  const workspaceId = selected ?? memberships[0]?.workspace_id ?? null;

  const value = useMemo<AuthValue>(
    () => ({
      loading: loading || (!!session && membershipsQuery.isLoading),
      session,
      user: session?.user ?? null,
      memberships,
      workspaceId,
      workspaceName:
        memberships.find((m) => m.workspace_id === workspaceId)?.workspaces?.name ??
        "Demo Workspace",
      role: memberships.find((m) => m.workspace_id === workspaceId)?.role ?? null,
      setWorkspaceId: (id: string) => {
        setSelected(id);
        if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, id);
      },
      refresh: () => {
        membershipsQuery.refetch();
        qc.invalidateQueries();
      },
    }),
    [loading, session, memberships, workspaceId, membershipsQuery, qc],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
