-- ==============================================================================
-- Migration: Fix Auth Workspace Onboarding & AI / MCP Infrastructure
-- Description:
-- 1. Sets create_workspace_with_demo to SECURITY DEFINER to ensure seamless onboarding.
-- 2. Grants execute rights to authenticated role for all core workspace functions.
-- 3. Creates ai_cache table to enable zero-waste token caching for LLM requests.
-- 4. Creates mcp_integrations table to store Meta & Google MCP configurations.
-- ==============================================================================

-- 1. Ensure create_workspace_with_demo is SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.create_workspace_with_demo(_name text, _with_demo boolean DEFAULT true)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ws uuid;
  c1 uuid; c2 uuid;
  p1 uuid; p2 uuid; p3 uuid;
  a_pain uuid; a_desire uuid; a_proof uuid; a_mech uuid; a_obj uuid;
  h1 uuid; h2 uuid; h3 uuid; h4 uuid;
  cp1 uuid; cp2 uuid;
  cr uuid; i int;
  statuses text[] := ARRAY['BACKLOG','BRIEFING','ESTRATEGIA','COPY','DIRECAO','PRODUCAO','REVISAO','APROVACAO','APROVADO','PUBLICADO','ANALISE','ITERAR'];
  names text[] := ARRAY['Depoimento Ana - Antes e Depois','Demonstração do App em 15s','Carrossel 5 Erros no Tráfego','Reels Bastidores da Clínica','Estático Oferta Black','UGC Cliente Real - Resultado','Comparativo Nós x Concorrente','Prova Social 4.9 Estrelas','Hook Pergunta - Você comete isso?','VSL Curta Mecanismo Único','Carrossel Objeções Respondidas','Reels Escassez Últimas Vagas'];
  plats text[] := ARRAY['Meta','Meta','Instagram','TikTok','Meta','Meta','Google','Meta','TikTok','YouTube','Instagram','Meta'];
  fmts text[] := ARRAY['Vídeo 9:16','Vídeo 9:16','Carrossel 4:5','Reels','Estático 1:1','Vídeo 9:16','Estático 1:1','Estático 4:5','Reels','Vídeo 16:9','Carrossel 4:5','Reels'];
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Usuário não autenticado';
  END IF;

  INSERT INTO public.workspaces (name, owner_id)
  VALUES (COALESCE(NULLIF(_name,''), 'Meu Workspace'), auth.uid())
  RETURNING id INTO ws;

  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (ws, auth.uid(), 'admin');

  UPDATE public.profiles
  SET current_workspace_id = ws, onboarded = true
  WHERE id = auth.uid();

  IF NOT _with_demo THEN
    RETURN ws;
  END IF;

  INSERT INTO public.clients (workspace_id, name, company, segment, contact_name, contact_email, contact_phone, status, brand_notes, brand_colors, brand_fonts, notes, is_demo)
  VALUES (ws, 'Clínica Vida Leve', 'Vida Leve Saúde LTDA', 'Saúde e Estética', 'Dra. Renata Alves', 'renata@vidaleve.com.br', '(11) 98877-1200', 'ativo', 'Tom acolhedor, linguagem simples, foco em segurança do procedimento.', ARRAY['#0E7C66','#F2F7F5'], 'Poppins + Inter', 'Cliente demo para você explorar o sistema.', true)
  RETURNING id INTO c1;

  INSERT INTO public.clients (workspace_id, name, company, segment, contact_name, contact_email, contact_phone, status, brand_notes, brand_colors, brand_fonts, notes, is_demo)
  VALUES (ws, 'EduPro Cursos', 'EduPro Educação Digital', 'Educação / Infoproduto', 'Marcos Tavares', 'marcos@edupro.com.br', '(21) 99123-4455', 'ativo', 'Tom direto, prova em números, sem promessa exagerada.', ARRAY['#1F3AE0','#0B0F1A'], 'Sora + DM Sans', 'Cliente demo para você explorar o sistema.', true)
  RETURNING id INTO c2;

  INSERT INTO public.projects (workspace_id, client_id, name, product, objective, platforms, funnel, starts_on, ends_on, status, owners, notes, is_demo) VALUES
   (ws, c1, 'Captação Harmonização Facial', 'Harmonização Facial', 'Gerar leads qualificados no WhatsApp', ARRAY['Meta','Instagram'], 'TOFU', CURRENT_DATE - 45, CURRENT_DATE + 30, 'ativo', ARRAY['Renata','Bruno'], 'Projeto demo.', true) RETURNING id INTO p1;
  INSERT INTO public.projects (workspace_id, client_id, name, product, objective, platforms, funnel, starts_on, ends_on, status, owners, notes, is_demo) VALUES
   (ws, c1, 'Remarketing Consultas', 'Consulta de Avaliação', 'Recuperar leads que não agendaram', ARRAY['Meta'], 'Remarketing', CURRENT_DATE - 20, CURRENT_DATE + 40, 'ativo', ARRAY['Bruno'], 'Projeto demo.', true) RETURNING id INTO p2;
  INSERT INTO public.projects (workspace_id, client_id, name, product, objective, platforms, funnel, starts_on, ends_on, status, owners, notes, is_demo) VALUES
   (ws, c2, 'Lançamento Método EduPro', 'Curso Método EduPro', 'Vender inscrições do curso', ARRAY['Meta','TikTok','YouTube'], 'MOFU', CURRENT_DATE - 30, CURRENT_DATE + 15, 'ativo', ARRAY['Marcos','Júlia'], 'Projeto demo.', true) RETURNING id INTO p3;

  INSERT INTO public.products (workspace_id, client_id, project_id, name, description, price, is_demo) VALUES
   (ws, c1, p1, 'Harmonização Facial', 'Procedimento estético com avaliação individual.', 3900, true),
   (ws, c2, p3, 'Método EduPro', 'Curso online de 8 semanas com mentoria em grupo.', 1497, true);

  INSERT INTO public.offers (workspace_id, client_id, project_id, name, promise, price, bonuses, guarantee, urgency, is_demo) VALUES
   (ws, c1, p1, 'Avaliação gratuita + plano personalizado', 'Saia da avaliação sabendo exatamente o que fazer no seu rosto.', 0, 'Simulação digital do resultado', 'Sem compromisso', 'Agenda limitada a 12 avaliações por semana', true),
   (ws, c2, p3, 'Método EduPro - Turma 7', 'Aprenda a estruturar campanhas que se pagam em 30 dias.', 1497, 'Planilhas + 4 mentorias ao vivo', '7 dias de garantia', 'Inscrições encerram sexta', true);

  INSERT INTO public.angles (workspace_id, name, category, description, when_to_use, examples, tags, is_demo) VALUES
   (ws, 'Dor do resultado que não vem', 'pain', 'Ataca a frustração de investir e não ver retorno.', 'Público problem aware, topo de funil.', '"Você investe todo mês e o resultado não muda?"', ARRAY['dor','tofu'], true) RETURNING id INTO a_pain;
  INSERT INTO public.angles (workspace_id, name, category, description, when_to_use, examples, tags, is_demo) VALUES
   (ws, 'Desejo de autoestima', 'desire', 'Foca no sentimento após o resultado.', 'Solution aware.', '"Olhar no espelho e gostar do que vê."', ARRAY['desejo'], true) RETURNING id INTO a_desire;
  INSERT INTO public.angles (workspace_id, name, category, description, when_to_use, examples, tags, is_demo) VALUES
   (ws, 'Prova social real', 'proof', 'Usa depoimento e números verificáveis.', 'Meio e fundo de funil.', '"1.240 alunos, nota 4.9."', ARRAY['prova','bofu'], true) RETURNING id INTO a_proof;
  INSERT INTO public.angles (workspace_id, name, category, description, when_to_use, examples, tags, is_demo) VALUES
   (ws, 'Mecanismo único', 'mechanism', 'Explica o "como funciona" que diferencia a oferta.', 'Product aware.', '"Protocolo em 3 camadas."', ARRAY['mecanismo'], true) RETURNING id INTO a_mech;
  INSERT INTO public.angles (workspace_id, name, category, description, when_to_use, examples, tags, is_demo) VALUES
   (ws, 'Quebra de objeção de preço', 'objection', 'Reposiciona o custo frente ao custo de não agir.', 'Fundo de funil.', '"Custa menos que um mês parado."', ARRAY['objeção','bofu'], true) RETURNING id INTO a_obj;

  INSERT INTO public.hooks (workspace_id, text, category, notes, tags, is_demo) VALUES
   (ws, 'Você comete esse erro no seu tráfego sem perceber?', 'pergunta', 'Bom para vídeo curto.', ARRAY['tofu'], true) RETURNING id INTO h1;
  INSERT INTO public.hooks (workspace_id, text, category, notes, tags, is_demo) VALUES
   (ws, 'Investi 3 meses e o resultado só veio quando mudei isso', 'dor', 'Formato depoimento.', ARRAY['story'], true) RETURNING id INTO h2;
  INSERT INTO public.hooks (workspace_id, text, category, notes, tags, is_demo) VALUES
   (ws, '1.240 alunos já passaram por esse processo', 'prova', 'Usar número real.', ARRAY['prova'], true) RETURNING id INTO h3;
  INSERT INTO public.hooks (workspace_id, text, category, notes, tags, is_demo) VALUES
   (ws, 'Em 15 segundos você entende como funciona', 'curiosidade', 'Abertura de demonstração.', ARRAY['demo'], true) RETURNING id INTO h4;

  RETURN ws;
END;
$$;

-- 2. Explicit grants for execution
GRANT EXECUTE ON FUNCTION public.create_workspace_with_demo(text, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_workspace_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.workspace_role(uuid) TO authenticated;

-- 3. AI Cache Table (Token Zero-Waste Architecture)
CREATE TABLE IF NOT EXISTS public.ai_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  service text NOT NULL, -- e.g., 'gemini-flash', 'meta-llama'
  cache_key text NOT NULL, -- deterministic hash of (prompt + system_instruction + parameters)
  prompt_summary text,
  response_data jsonb NOT NULL,
  tokens_saved integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days')
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_cache TO authenticated;
GRANT ALL ON public.ai_cache TO service_role;
ALTER TABLE public.ai_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members manage ai_cache" ON public.ai_cache FOR ALL TO authenticated
  USING (public.is_workspace_member(workspace_id)) WITH CHECK (public.is_workspace_member(workspace_id));
CREATE INDEX IF NOT EXISTS ai_cache_lookup_idx ON public.ai_cache (workspace_id, service, cache_key);

-- 4. MCP Integrations Table (Meta Ads & Google MCP configs)
CREATE TABLE IF NOT EXISTS public.mcp_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  provider text NOT NULL, -- 'meta', 'google', 'gemini'
  status text NOT NULL DEFAULT 'disconnected', -- 'connected', 'error', 'disconnected'
  account_id text,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  last_synced_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, provider)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.mcp_integrations TO authenticated;
GRANT ALL ON public.mcp_integrations TO service_role;
ALTER TABLE public.mcp_integrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members manage mcp_integrations" ON public.mcp_integrations FOR ALL TO authenticated
  USING (public.is_workspace_member(workspace_id)) WITH CHECK (public.is_workspace_member(workspace_id));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.mcp_integrations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
