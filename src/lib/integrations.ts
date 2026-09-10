/**
 * Interfaces preparadas para integrações externas (Meta Ads, Google Ads, TikTok,
 * Figma, Google Drive, Slack, WhatsApp, webhooks e IA).
 *
 * Nenhuma conexão real existe nesta versão. Os provedores abaixo declaram o
 * contrato que uma implementação futura deve cumprir e sempre reportam
 * `connected: false`, para que a interface nunca apresente dado externo como real.
 */

import type { PerformanceRow } from "./domain";

export type IntegrationKey =
  | "meta_ads"
  | "google_ads"
  | "tiktok_ads"
  | "figma"
  | "google_drive"
  | "slack"
  | "whatsapp"
  | "webhooks"
  | "ai";

export type IntegrationDescriptor = {
  key: IntegrationKey;
  name: string;
  category: "Mídia" | "Criação" | "Comunicação" | "Automação" | "IA";
  description: string;
  capabilities: string[];
  connected: boolean;
};

export const INTEGRATIONS: IntegrationDescriptor[] = [
  {
    key: "meta_ads",
    name: "Meta Ads",
    category: "Mídia",
    description: "Importação de performance por criativo, campanha e período.",
    capabilities: ["Ler métricas", "Sincronizar campanhas", "Enviar criativos aprovados"],
    connected: false,
  },
  {
    key: "google_ads",
    name: "Google Ads",
    category: "Mídia",
    description: "Importação de métricas de rede de display, vídeo e search.",
    capabilities: ["Ler métricas", "Sincronizar campanhas"],
    connected: false,
  },
  {
    key: "tiktok_ads",
    name: "TikTok Ads",
    category: "Mídia",
    description: "Importação de métricas de vídeo e criativos nativos.",
    capabilities: ["Ler métricas", "Sincronizar campanhas"],
    connected: false,
  },
  {
    key: "figma",
    name: "Figma",
    category: "Criação",
    description: "Vincular frames de direção de arte e versões visuais.",
    capabilities: ["Ler frames", "Sincronizar thumbnails"],
    connected: false,
  },
  {
    key: "google_drive",
    name: "Google Drive",
    category: "Criação",
    description: "Repositório de assets finais e brutos.",
    capabilities: ["Listar arquivos", "Vincular assets"],
    connected: false,
  },
  {
    key: "slack",
    name: "Slack",
    category: "Comunicação",
    description: "Avisos de aprovação e prazos no canal do time.",
    capabilities: ["Enviar notificações"],
    connected: false,
  },
  {
    key: "whatsapp",
    name: "WhatsApp",
    category: "Comunicação",
    description: "Aprovação e avisos com o cliente.",
    capabilities: ["Enviar mensagens", "Receber aprovação"],
    connected: false,
  },
  {
    key: "webhooks",
    name: "Webhooks",
    category: "Automação",
    description: "Disparo de eventos do Creative OS para sistemas externos.",
    capabilities: ["Enviar eventos", "Assinar eventos"],
    connected: false,
  },
  {
    key: "ai",
    name: "Assistentes de IA",
    category: "IA",
    description: "Geração assistida de ângulos, hooks, copy e diagnósticos.",
    capabilities: ["Sugerir hooks", "Revisar copy", "Explicar performance"],
    connected: false,
  },
];

/** Contrato que um conector de mídia deve implementar quando existir. */
export interface AdsConnector {
  key: IntegrationKey;
  isConnected(): Promise<boolean>;
  listCampaigns(): Promise<{ id: string; name: string; platform: string }[]>;
  fetchPerformance(input: {
    campaignId?: string;
    from: string;
    to: string;
  }): Promise<PerformanceRow[]>;
}

export class NotConnectedError extends Error {
  constructor(name: string) {
    super(`A integração ${name} ainda não está conectada nesta versão.`);
    this.name = "NotConnectedError";
  }
}

export function adsConnector(key: IntegrationKey): AdsConnector {
  const descriptor = INTEGRATIONS.find((i) => i.key === key);
  const name = descriptor?.name ?? key;
  return {
    key,
    isConnected: async () => false,
    listCampaigns: async () => {
      throw new NotConnectedError(name);
    },
    fetchPerformance: async () => {
      throw new NotConnectedError(name);
    },
  };
}
