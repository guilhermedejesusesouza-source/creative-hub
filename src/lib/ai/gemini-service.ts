import { computeHash, getCachedAIResponse, setCachedAIResponse } from "./cache";
import type {
  DiagnosePerformanceInput,
  GenerateCopyInput,
  GenerateHooksInput,
  GeneratedCopy,
  GeneratedHook,
  PerformanceDiagnosis,
} from "./types";

/**
 * Token-frugal micro-prompt generator for Hooks
 */
export async function generateCreativeHooks(
  input: GenerateHooksInput,
  apiKey?: string,
): Promise<{ hooks: GeneratedHook[]; cached: boolean }> {
  const cacheKey = await computeHash({
    action: "generate_hooks",
    client: input.clientName,
    product: input.productName,
    promise: input.offerPromise,
    category: input.category,
    count: input.count ?? 4,
  });

  // 1. Check zero-waste token cache
  const cached = await getCachedAIResponse<GeneratedHook[]>(
    input.workspaceId,
    "gemini-flash",
    cacheKey,
  );
  if (cached && cached.length > 0) {
    return { hooks: cached, cached: true };
  }

  // 2. If API Key is provided, call Google Gemini Flash API with compact structured output
  const key =
    apiKey ||
    (typeof process !== "undefined"
      ? process.env["VITE_GEMINI_API_KEY"] || process.env["GEMINI_API_KEY"]
      : "");

  let hooks: GeneratedHook[] = [];

  if (key) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
      const systemInstruction = `Você é um copywriter sênior de tráfego pago especialista em hooks para Meta Ads e TikTok.
Gere ganchos de alta retenção (3 segundos). Retorne APENAS um array JSON de objetos com as chaves: "text", "category", "rationale", "format".
Sem markdown, sem explicações adicionais.`;

      const prompt = `Cliente: ${input.clientName} (${input.segment || "Geral"})
Produto: ${input.productName}
Promessa: ${input.offerPromise || "Oferta direta"}
Público: ${input.targetAudience || "Público amplo"}
Categoria desejada: ${input.category || "misto"}
Quantidade: ${input.count || 4}`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json",
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawJson) {
          hooks = JSON.parse(rawJson);
        }
      }
    } catch (e) {
      console.warn("[Gemini AI] Call failed, falling back to local heuristic:", e);
    }
  }

  // 3. High-quality heuristic fallback if no API key or network error
  if (!hooks || hooks.length === 0) {
    hooks = [
      {
        text: `Você ainda comete o erro número 1 com ${input.productName}?`,
        category: input.category || "dor",
        rationale: "Gera curiosidade imediata e ativa aversão à perda nos primeiros 2 segundos.",
        format: "video_9_16",
      },
      {
        text: `O que ninguém te conta sobre ${input.productName} antes de comprar:`,
        category: "quebra_de_padrao",
        rationale: "Formato de segredo revelado que quebra o scroll passivo.",
        format: "reels",
      },
      {
        text: `Como ter ${input.offerPromise || "o melhor resultado"} sem complicação:`,
        category: "beneficio",
        rationale: "Foco no benefício final claro para público com consciência da solução.",
        format: "carrossel",
      },
      {
        text: `Veja como funciona na prática em 15 segundos:`,
        category: "curiosidade",
        rationale: "Demonstração rápida com baixo atrito mental de consumo.",
        format: "video_9_16",
      },
    ];
  }

  // 4. Save to cache
  await setCachedAIResponse(
    input.workspaceId,
    "gemini-flash",
    cacheKey,
    hooks,
    `Hooks para ${input.clientName} - ${input.productName}`,
    180,
  );

  return { hooks, cached: false };
}

/**
 * Diagnoses Creative Performance using ultra-compact token distillation
 */
export async function diagnoseCreativePerformance(
  input: DiagnosePerformanceInput,
  apiKey?: string,
): Promise<{ diagnosis: PerformanceDiagnosis; cached: boolean }> {
  const cacheKey = await computeHash({
    action: "diagnose_performance",
    ad: input.adName,
    platform: input.platform,
    spend: Math.round(input.spend),
    roas: Math.round(input.roas * 10) / 10,
    ctr: Math.round(input.ctr * 10) / 10,
  });

  const cached = await getCachedAIResponse<PerformanceDiagnosis>(
    input.workspaceId,
    "gemini-flash",
    cacheKey,
  );
  if (cached) {
    return { diagnosis: cached, cached: true };
  }

  // Compute local mathematical metrics first to save tokens
  let status: PerformanceDiagnosis["status"] = "atencao";
  let bottleneck: PerformanceDiagnosis["bottleneck"] = "nenhum";
  let score = 50;
  const recommendations: string[] = [];

  if (input.roas >= 2.5 && input.ctr >= 1.2) {
    status = "vencedor";
    score = 88;
    recommendations.push(
      "Criativo vencedor validado. Duplicar e testar escala horizontal de orçamento.",
    );
    recommendations.push(
      "Produzir 3 variações apenas dos primeiros 3 segundos (hooks alternativos).",
    );
  } else if (input.ctr < 0.8) {
    status = "atencao";
    bottleneck = "hook";
    score = 42;
    recommendations.push(
      "CTR baixo indica que os primeiros 3 segundos não estão retendo a atenção.",
    );
    recommendations.push("Trocar o hook de abertura e testar formato com texto dinâmico na tela.");
  } else if (input.roas < 1.0 && input.spend > 100) {
    status = "reprovar";
    bottleneck = "oferta";
    score = 25;
    recommendations.push("Gasto significativo sem retorno. Pausar o criativo para estancar perda.");
    recommendations.push("Rever promessa da página de destino ou público-alvo.");
  } else {
    status = "atencao";
    bottleneck = "retencao";
    score = 60;
    recommendations.push("Métricas médias. Manter em teste por mais 48h com orçamento controlado.");
  }

  const diagnosis: PerformanceDiagnosis = {
    status,
    bottleneck,
    score,
    recommendations,
    iterationIdea: `Criar variação B mantendo o corpo do anúncio, mas substituindo o gancho inicial por um ângulo focado em "${bottleneck === "hook" ? "quebra de padrão" : "prova social"}".`,
  };

  await setCachedAIResponse(
    input.workspaceId,
    "gemini-flash",
    cacheKey,
    diagnosis,
    `Diagnóstico de ${input.adName} (${input.platform})`,
    250,
  );

  return { diagnosis, cached: false };
}
