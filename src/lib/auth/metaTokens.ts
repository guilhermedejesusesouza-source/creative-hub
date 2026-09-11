import { supabase } from '@/integrations/supabase/client';

/**
 * Store a Meta access token for a workspace.
 * Upserts on workspace_id so each workspace has at most one token.
 */
export async function saveMetaToken(
  workspaceId: string,
  token: string,
  expiresAt?: string,
): Promise<boolean> {
  const { error } = await supabase
    .from('meta_tokens' as any)
    .upsert(
      {
        workspace_id: workspaceId,
        access_token: token,
        expires_at: expiresAt ?? null,
      },
      { onConflict: 'workspace_id' },
    );
  return !error;
}

/** Retrieve the stored Meta token for a workspace. */
export async function getMetaToken(workspaceId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('meta_tokens' as any)
    .select('access_token')
    .eq('workspace_id', workspaceId)
    .single();
  if (error || !data) return null;
  return (data as any).access_token as string;
}
