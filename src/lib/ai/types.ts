export type AIProvider = "google_gemini" | "meta_llama";

export type GenerateHooksInput = {
  workspaceId: string;
  clientName: string;
  segment?: string;
  productName: string;
  offerPromise?: string;
  targetAudience?: string;
  tone?: string;
  category?: "curiosidade" | "dor" | "prova" | "urgencia" | "quebra_de_padrao" | "beneficio";
  count?: number;
};

export type GeneratedHook = {
  text: string;
  category: string;
  rationale: string;
  format: "video_9_16" | "carrossel" | "estatico" | "reels";
};

export type GenerateCopyInput = {
  workspaceId: string;
  clientName: string;
  productName: string;
  hookText: string;
  awareness: "unaware" | "problem_aware" | "solution_aware" | "product_aware" | "most_aware";
  cta?: string;
};

export type GeneratedCopy = {
  headline: string;
  primary_text: string;
  cta: string;
  framework: string; // AIDA, PAS, BAB, etc.
};

export type DiagnosePerformanceInput = {
  workspaceId: string;
  adName: string;
  platform: "Meta" | "Google" | "TikTok";
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  conversions: number;
  roas: number;
  hookRate?: number; // 3s view / impressions
  holdRate?: number; // 15s / 3s
};

export type PerformanceDiagnosis = {
  status: "vencedor" | "atencao" | "fadiga" | "reprovar";
  bottleneck: "hook" | "retencao" | "oferta" | "pagina" | "nenhum";
  score: number; // 0 to 100
  recommendations: string[];
  iterationIdea: string;
};
