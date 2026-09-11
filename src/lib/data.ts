import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

type Row = Record<string, unknown>;

/** Cliente sem tipagem estrita de tabela: as telas usam nomes dinâmicos. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export type ListOptions = {
  select?: string;
  orderBy?: string;
  ascending?: boolean;
  eq?: Record<string, string | number | boolean | null | undefined>;
  limit?: number;
  enabled?: boolean;
};

export function useRows<T = Row>(
  table: string,
  workspaceId: string | null | undefined,
  options: ListOptions = {},
) {
  const { select = "*", orderBy = "created_at", ascending = false, eq = {}, limit } = options;
  return useQuery<T[]>({
    queryKey: [table, workspaceId, select, orderBy, ascending, eq, limit],
    enabled: !!workspaceId && options.enabled !== false,
    queryFn: async () => {
      let q = db.from(table).select(select).eq("workspace_id", workspaceId);
      for (const [k, v] of Object.entries(eq)) {
        if (v !== undefined && v !== null && v !== "") q = q.eq(k, v);
      }
      q = q.order(orderBy, { ascending });
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });
}

export function useRow<T = Row>(table: string, id?: string, select = "*") {
  return useQuery<T | null>({
    queryKey: [table, "one", id, select],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await db.from(table).select(select).eq("id", id).maybeSingle();
      if (error) throw error;
      return (data ?? null) as T | null;
    },
  });
}

function invalidate(qc: ReturnType<typeof useQueryClient>, table: string) {
  qc.invalidateQueries({ predicate: (q) => q.queryKey[0] === table });
}

export function useSaveRow(table: string, messages?: { success?: string }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Row & { id?: string }) => {
      const { id, ...rest } = values;
      const query = id
        ? db.from(table).update(rest).eq("id", id).select().maybeSingle()
        : db.from(table).insert(rest).select().maybeSingle();
      const { data, error } = await query;
      if (error) throw error;
      return data as Row;
    },
    onSuccess: () => {
      invalidate(qc, table);
      toast.success(messages?.success ?? "Salvo com sucesso");
    },
    onError: (e: Error) => toast.error(e.message || "Não foi possível salvar"),
  });
}

export function useDeleteRow(table: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate(qc, table);
      toast.success("Registro excluído");
    },
    onError: (e: Error) => toast.error(e.message || "Não foi possível excluir"),
  });
}

export async function logActivity(values: Row) {
  await db.from("crm_activities").insert(values);
}
