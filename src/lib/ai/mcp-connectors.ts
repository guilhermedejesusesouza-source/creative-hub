import { supabase } from "@/integrations/supabase/client";

export type MCPProvider = "meta" | "google" | "gemini";

export type MCPIntegrationStatus = {
  provider: MCPProvider;
  name: string;
  description: string;
  status: "connected" | "disconnected" | "error";
  accountId?: string;
  lastSyncedAt?: string;
};

/**
 * Fetches all MCP integration states for the given workspace
 */
export async function getMCPIntegrations(workspaceId: string): Promise<MCPIntegrationStatus[]> {
  const defaultIntegrations: MCPIntegrationStatus[] = [
    {
      provider: "meta",
      name: "Meta Marketing & Ads MCP",
      description:
        "Sincroniza criativos, ad sets, campanhas e métricas (CTR, ROAS, Thumbstop) do Facebook e Instagram Ads.",
      status: "disconnected",
    },
    {
      provider: "google",
      name: "Google Ads & Workspace MCP",
      description:
        "Conecta campanhas de Search/PMax do Google Ads e importa briefings do Google Drive.",
      status: "disconnected",
    },
    {
      provider: "gemini",
      name: "Google Gemini 2.5/3.8 Flash AI",
      description:
        "Motor multimodal para geração ultra-rápida de ganchos, cópias e diagnósticos de anúncios.",
      status: "connected",
    },
  ];

  try {
    const { data, error } = await supabase
      .from("mcp_integrations" as any)
      .select("provider, status, account_id, last_synced_at")
      .eq("workspace_id", workspaceId);

    if (error || !data) return defaultIntegrations;

    return defaultIntegrations.map((item) => {
      const found = (data as any[]).find((d) => d.provider === item.provider);
      if (found) {
        return {
          ...item,
          status: found.status,
          accountId: found.account_id,
          lastSyncedAt: found.last_synced_at,
        };
      }
      return item;
    });
  } catch {
    return defaultIntegrations;
  }
}

/**
 * Updates or toggles an MCP integration status
 */
export async function saveMCPIntegration(
  workspaceId: string,
  provider: MCPProvider,
  status: "connected" | "disconnected",
  accountId?: string,
  settings: Record<string, unknown> = {},
): Promise<boolean> {
  try {
    const { error } = await supabase.from("mcp_integrations" as any).upsert(
      {
        workspace_id: workspaceId,
        provider,
        status,
        account_id: accountId || null,
        settings,
        last_synced_at: status === "connected" ? new Date().toISOString() : null,
      },
      { onConflict: "workspace_id,provider" },
    );

    return !error;
  } catch {
    return false;
  }
}

/**
 * Token Frugal Compressor for Meta Ads payload
 * Reduces thousands of lines of raw JSON to essential metrics for LLM digestion
 */
export function compressMetaAdsData(ads: Array<Record<string, unknown>>): Array<{
  id: string;
  name: string;
  spend: number;
  roas: number;
  ctr: number;
  hookRate?: number;
}> {
  return ads.map((ad) => {
    const insights = (ad.insights as any)?.data?.[0] || ad;
    const spend = Number(insights.spend || 0);
    const purchaseVal = Number(
      insights.action_values?.find((a: any) => a.action_type === "purchase")?.value || 0,
    );
    const roas = spend > 0 ? purchaseVal / spend : 0;
    const ctr = Number(insights.ctr || 0);

    return {
      id: String(ad.id || ""),
      name: String(ad.name || "Sem nome"),
      spend: Math.round(spend * 100) / 100,
      roas: Math.round(roas * 100) / 100,
      ctr: Math.round(ctr * 100) / 100,
      hookRate: insights.video_play_actions ? 0.35 : undefined,
    };
  });
}
