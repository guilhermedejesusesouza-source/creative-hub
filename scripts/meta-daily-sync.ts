import { supabase } from '@/integrations/supabase/client';
import { syncMetaAds } from '@/lib/ai/mcp-connectors';

/**
 * Runs a daily sync for all workspaces that have Meta MCP connected.
 */
async function runDailyMetaSync() {
  const { data: workspaces, error } = await supabase.from('workspaces' as any).select('id');
  if (error) {
    console.error('Failed to fetch workspaces', error);
    return;
  }
  for (const ws of workspaces as any[]) {
    const wsId = ws.id as string;
    // Check if Meta integration is connected
    const { data: integration } = await supabase
      .from('mcp_integrations' as any)
      .select('status')
      .eq('workspace_id', wsId)
      .eq('provider', 'meta')
      .single();
    if (integration && (integration as any).status === 'connected') {
      console.log(`Syncing Meta ads for workspace ${wsId}`);
      const success = await syncMetaAds(wsId);
      if (!success) {
        console.warn(`Meta sync failed for workspace ${wsId}`);
      }
    }
  }
  console.log('Meta daily sync completed');
}

runDailyMetaSync();
