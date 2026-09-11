import { supabase } from "@/integrations/supabase/client";

/**
 * Creates a deterministic SHA-256 hash string from input parameters
 */
export async function computeHash(input: Record<string, unknown> | string): Promise<string> {
  const str = typeof input === "string" ? input : JSON.stringify(input, Object.keys(input).sort());
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  // Fallback simple hash for non-subtle crypto environments
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `h_${Math.abs(hash).toString(16)}`;
}

/**
 * Checks if a cached response exists and is still valid (not expired)
 */
export async function getCachedAIResponse<T>(
  workspaceId: string,
  service: string,
  cacheKey: string,
): Promise<T | null> {
  try {
    const { data, error } = await supabase
      .from("ai_cache" as any)
      .select("response_data, expires_at")
      .eq("workspace_id", workspaceId)
      .eq("service", service)
      .eq("cache_key", cacheKey)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (error || !data) return null;
    return (data as any).response_data as T;
  } catch {
    return null;
  }
}

/**
 * Saves an AI generation response to the cache to prevent redundant token consumption
 */
export async function setCachedAIResponse<T>(
  workspaceId: string,
  service: string,
  cacheKey: string,
  responseData: T,
  promptSummary?: string,
  tokensSaved = 0,
): Promise<void> {
  try {
    await supabase.from("ai_cache" as any).insert({
      workspace_id: workspaceId,
      service,
      cache_key: cacheKey,
      prompt_summary: promptSummary ?? null,
      response_data: responseData,
      tokens_saved: tokensSaved,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
  } catch (err) {
    console.warn("[AI Cache] Failed to write cache entry:", err);
  }
}
