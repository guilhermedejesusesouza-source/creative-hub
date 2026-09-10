revoke execute on function public.handle_new_user() from anon, authenticated, public;
revoke execute on function public.workspace_role(uuid) from anon, authenticated, public;
revoke execute on function public.is_workspace_member(uuid) from anon, public;

create or replace function public.create_workspace_with_demo(_name text, _with_demo boolean default true)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  ws uuid;
  c1 uuid; c2 uuid;
  p1 uuid; p2 uuid; p3 uuid;
  a_pain uuid; a_desire uuid; a_proof uuid; a_mech uuid; a_obj uuid;
  h1 uuid; h2 uuid; h3 uuid; h4 uuid;
  cp1 uuid; cp2 uuid;
  cr uuid; i int;
  statuses text[] := array['BACKLOG','BRIEFING','ESTRATEGIA','COPY','DIRECAO','PRODUCAO','REVISAO','APROVACAO','APROVADO','PUBLICADO','ANALISE','ITERAR'];
  names text[] := array['Depoimento Ana - Antes e Depois','Demonstração do App em 15s','Carrossel 5 Erros no Tráfego','Reels Bastidores da Clínica','Estático Oferta Black','UGC Cliente Real - Resultado','Comparativo Nós x Concorrente','Prova Social 4.9 Estrelas','Hook Pergunta - Você comete isso?','VSL Curta Mecanismo Único','Carrossel Objeções Respondidas','Reels Escassez Últimas Vagas'];
  plats text[] := array['Meta','Meta','Instagram','TikTok','Meta','Meta','Google','Meta','TikTok','YouTube','Instagram','Meta'];
  fmts text[] := array['Vídeo 9:16','Vídeo 9:16','Carrossel 4:5','Reels','Estático 1:1','Vídeo 9:16','Estático 1:1','Estático 4:5','Reels','Vídeo 16:9','Carrossel 4:5','Reels'];
begin
  if auth.uid() is null then raise exception 'Usuário não autenticado'; end if;

  insert into public.workspaces (name, owner_id) values (coalesce(nullif(_name,''),'Meu Workspace'), auth.uid()) returning id into ws;
  insert into public.workspace_members (workspace_id, user_id, role) values (ws, auth.uid(), 'admin');
  update public.profiles set current_workspace_id = ws, onboarded = true where id = auth.uid();

  if not _with_demo then return ws; end if;

  insert into public.clients (workspace_id, name, company, segment, contact_name, contact_email, contact_phone, status, brand_notes, brand_colors, brand_fonts, notes, is_demo)
  values (ws,'Clínica Vida Leve','Vida Leve Saúde LTDA','Saúde e Estética','Dra. Renata Alves','renata@vidaleve.com.br','(11) 98877-1200','ativo','Tom acolhedor, linguagem simples, foco em segurança do procedimento.', array['#0E7C66','#F2F7F5'],'Poppins + Inter','Cliente demo para você explorar o sistema.',true)
  returning id into c1;

  insert into public.clients (workspace_id, name, company, segment, contact_name, contact_email, contact_phone, status, brand_notes, brand_colors, brand_fonts, notes, is_demo)
  values (ws,'EduPro Cursos','EduPro Educação Digital','Educação / Infoproduto','Marcos Tavares','marcos@edupro.com.br','(21) 99123-4455','ativo','Tom direto, prova em números, sem promessa exagerada.', array['#1F3AE0','#0B0F1A'],'Sora + DM Sans','Cliente demo para você explorar o sistema.',true)
  returning id into c2;

  insert into public.projects (workspace_id, client_id, name, product, objective, platforms, funnel, starts_on, ends_on, status, owners, notes, is_demo) values
   (ws,c1,'Captação Harmonização Facial','Harmonização Facial','Gerar leads qualificados no WhatsApp', array['Meta','Instagram'],'TOFU', current_date - 45, current_date + 30,'ativo', array['Renata','Bruno'],'Projeto demo.',true) returning id into p1;
  insert into public.projects (workspace_id, client_id, name, product, objective, platforms, funnel, starts_on, ends_on, status, owners, notes, is_demo) values
   (ws,c1,'Remarketing Consultas','Consulta de Avaliação','Recuperar leads que não agendaram', array['Meta'],'Remarketing', current_date - 20, current_date + 40,'ativo', array['Bruno'],'Projeto demo.',true) returning id into p2;
  insert into public.projects (workspace_id, client_id, name, product, objective, platforms, funnel, starts_on, ends_on, status, owners, notes, is_demo) values
   (ws,c2,'Lançamento Método EduPro','Curso Método EduPro','Vender inscrições do curso', array['Meta','TikTok','YouTube'],'MOFU', current_date - 30, current_date + 15,'ativo', array['Marcos','Júlia'],'Projeto demo.',true) returning id into p3;

  insert into public.products (workspace_id, client_id, project_id, name, description, price, is_demo) values
   (ws,c1,p1,'Harmonização Facial','Procedimento estético com avaliação individual.',3900,true),
   (ws,c2,p3,'Método EduPro','Curso online de 8 semanas com mentoria em grupo.',1497,true);

  insert into public.offers (workspace_id, client_id, project_id, name, promise, price, bonuses, guarantee, urgency, is_demo) values
   (ws,c1,p1,'Avaliação gratuita + plano personalizado','Saia da avaliação sabendo exatamente o que fazer no seu rosto.',0,'Simulação digital do resultado','Sem compromisso','Agenda limitada a 12 avaliações por semana',true),
   (ws,c2,p3,'Método EduPro - Turma 7','Aprenda a estruturar campanhas que se pagam em 30 dias.',1497,'Planilhas + 4 mentorias ao vivo','7 dias de garantia','Inscrições encerram sexta',true);

  insert into public.angles (workspace_id, name, category, description, when_to_use, examples, tags, is_demo) values
   (ws,'Dor do resultado que não vem','pain','Ataca a frustração de investir e não ver retorno.','Público problem aware, topo de funil.','"Você investe todo mês e o resultado não muda?"', array['dor','tofu'],true) returning id into a_pain;
  insert into public.angles (workspace_id, name, category, description, when_to_use, examples, tags, is_demo) values
   (ws,'Desejo de autoestima','desire','Foca no sentimento após o resultado.','Solution aware.','"Olhar no espelho e gostar do que vê."', array['desejo'],true) returning id into a_desire;
  insert into public.angles (workspace_id, name, category, description, when_to_use, examples, tags, is_demo) values
   (ws,'Prova social real','proof','Usa depoimento e números verificáveis.','Meio e fundo de funil.','"1.240 alunos, nota 4.9."', array['prova','bofu'],true) returning id into a_proof;
  insert into public.angles (workspace_id, name, category, description, when_to_use, examples, tags, is_demo) values
   (ws,'Mecanismo único','mechanism','Explica o "como funciona" que diferencia a oferta.','Product aware.','"Protocolo em 3 camadas."', array['mecanismo'],true) returning id into a_mech;
  insert into public.angles (workspace_id, name, category, description, when_to_use, examples, tags, is_demo) values
   (ws,'Quebra de objeção de preço','objection','Reposiciona o custo frente ao custo de não agir.','Fundo de funil.','"Custa menos que um mês parado."', array['objeção','bofu'],true) returning id into a_obj;
  insert into public.angles (workspace_id, name, category, description, when_to_use, examples, tags, is_demo) values
   (ws,'Erro comum do mercado','error','Mostra o erro que quase todos cometem.','Problem aware.','"O erro nº1 ao escalar campanhas."', array['erro'],true),
   (ws,'Comparação honesta','comparison','Compara caminhos sem atacar concorrente.','Solution aware.','"Agência x time interno."', array['comparação'],true),
   (ws,'Demonstração ao vivo','demonstration','Mostra o produto funcionando.','Product aware.','"Veja em 15 segundos."', array['demo'],true),
   (ws,'Novidade','novelty','Explora o que mudou agora.','Todos os níveis.','"O que mudou no algoritmo em 2026."', array['novidade'],true),
   (ws,'Contra-intuitivo','contrarian','Contraria o senso comum com fundamento.','Public frio engajado.','"Pare de aumentar orçamento."', array['contra'],true);

  insert into public.hooks (workspace_id, text, category, notes, tags, is_demo) values
   (ws,'Você comete esse erro no seu tráfego sem perceber?','pergunta','Bom para vídeo curto.', array['tofu'],true) returning id into h1;
  insert into public.hooks (workspace_id, text, category, notes, tags, is_demo) values
   (ws,'Investi 3 meses e o resultado só veio quando mudei isso','dor','Formato depoimento.', array['story'],true) returning id into h2;
  insert into public.hooks (workspace_id, text, category, notes, tags, is_demo) values
   (ws,'1.240 alunos já passaram por esse processo','prova','Usar número real.', array['prova'],true) returning id into h3;
  insert into public.hooks (workspace_id, text, category, notes, tags, is_demo) values
   (ws,'Em 15 segundos você entende como funciona','curiosidade','Abertura de demonstração.', array['demo'],true) returning id into h4;
  insert into public.hooks (workspace_id, text, category, notes, tags, is_demo) values
   (ws,'A agenda fecha sexta e não reabre esse mês','urgencia',null, array['bofu'],true),
   (ws,'Ninguém te conta isso sobre harmonização','quebra_de_padrao',null, array['tofu'],true),
   (ws,'O que mudou: antes x depois de 30 dias','contraste',null, array['prova'],true),
   (ws,'Quem faz avaliação antes economiza duas vezes','beneficio',null, array['mofu'],true),
   (ws,'Especialista com 12 anos explica o protocolo','autoridade',null, array['autoridade'],true);

  insert into public.copy_items (workspace_id, client_id, project_id, title, headline, primary_text, cta, format, funnel, awareness, tags, is_demo) values
   (ws,c1,p1,'Avaliação gratuita - versão dor','Seu rosto merece um plano, não um chute','Muita gente faz procedimento sem avaliação e depois precisa corrigir. Na avaliação você entende o que faz sentido para o seu rosto — e o que não faz.','Agendar avaliação','Vídeo 9:16','TOFU','problem_aware', array['demo'],true) returning id into cp1;
  insert into public.copy_items (workspace_id, client_id, project_id, title, headline, primary_text, cta, format, funnel, awareness, tags, is_demo) values
   (ws,c2,p3,'Método EduPro - prova','1.240 alunos, nota 4.9','O Método EduPro organiza sua operação de tráfego em 8 semanas: estrutura, criativos e leitura de dados. Turma 7 com mentoria ao vivo.','Ver a turma 7','Carrossel 4:5','MOFU','solution_aware', array['demo'],true) returning id into cp2;

  insert into public.briefs (workspace_id, client_id, project_id, title, status, awareness, funnel, data, is_demo) values
   (ws,c1,p1,'Master Brief - Harmonização Facial','finalizado','problem_aware','TOFU', jsonb_build_object(
     'negocio','Clínica de estética com 12 anos e 3 salas de atendimento em São Paulo.',
     'produto','Harmonização facial com avaliação individual e simulação digital.',
     'oferta','Avaliação gratuita com plano personalizado, sem compromisso.',
     'objetivo','40 leads qualificados por semana no WhatsApp com CPL até R$ 28.',
     'publico','Mulheres 28-45, classe B, buscam naturalidade e segurança.',
     'voc','"Tenho medo de ficar artificial"; "quero algo sutil".',
     'consciencia','problem_aware',
     'funil','TOFU',
     'copy','Tom acolhedor, sem promessa exagerada, foco em segurança.',
     'marca','Verde profundo, tipografia Poppins, fotos reais da clínica.',
     'visual','Luz natural, ambiente real, sem banco de imagens.',
     'formatos','Reels 9:16, carrossel 4:5, estático 1:1.',
     'referencias','Clínicas premium com comunicação educativa.',
     'restricoes','Não usar antes/depois sem autorização e sem CRM visível.'), true),
   (ws,c2,p3,'Master Brief - Método EduPro','rascunho','solution_aware','MOFU', jsonb_build_object(
     'negocio','Escola online de tráfego pago com 1.240 alunos.',
     'produto','Curso de 8 semanas com mentoria em grupo.',
     'objetivo','120 inscrições com CPA até R$ 240.'), true);

  insert into public.icps (workspace_id, client_id, name, description, pains, desires, objections, demographics, is_demo) values
   (ws,c1,'Mulher que quer naturalidade','Busca resultado discreto e seguro.','Medo de exagero e de profissional despreparado.','Parecer descansada e natural.','"É seguro?", "vai ficar artificial?"','Mulheres 28-45, São Paulo',true),
   (ws,c2,'Gestor de tráfego iniciante','Já roda campanhas mas sem método.','Resultados instáveis e retrabalho.','Previsibilidade e clientes maiores.','"Não tenho tempo", "já fiz outro curso"','25-40, Brasil',true);

  insert into public.voc_items (workspace_id, client_id, quote, source, category, tags, is_demo) values
   (ws,c1,'Tenho medo de ficar com o rosto artificial.','Comentário no Instagram','medo', array['objeção'],true),
   (ws,c1,'Queria algo sutil, que ninguém percebesse.','Depoimento pós-consulta','desejo', array['desejo'],true),
   (ws,c2,'Já comprei curso e travei na prática.','Formulário de inscrição','objeção', array['objeção'],true);

  for i in 1..12 loop
    insert into public.creatives (workspace_id, name, client_id, project_id, brief_id, product, offer, platform, format, objective, funnel, awareness,
      angle_id, hook_id, copy_id, headline, primary_text, cta,
      hypothesis_change, hypothesis_result, hypothesis_reason, hypothesis_expectation, hypothesis_actual,
      owner, priority, status, tags, references_notes, due_date,
      score_clarity, score_hook, score_hierarchy, score_relevance, score_differentiation, score_proof, score_cta, score_platform_fit, is_demo)
    values (ws, names[i],
      case when i <= 7 then c1 else c2 end,
      case when i <= 5 then p1 when i <= 7 then p2 else p3 end,
      null,
      case when i <= 7 then 'Harmonização Facial' else 'Método EduPro' end,
      case when i <= 7 then 'Avaliação gratuita' else 'Turma 7' end,
      plats[i], fmts[i],
      case when i <= 7 then 'Leads' else 'Vendas' end,
      case when i % 3 = 0 then 'BOFU' when i % 3 = 1 then 'TOFU' else 'MOFU' end,
      case when i % 4 = 0 then 'product_aware' when i % 4 = 1 then 'problem_aware' when i % 4 = 2 then 'solution_aware' else 'unaware' end,
      case when i % 5 = 0 then a_obj when i % 5 = 1 then a_pain when i % 5 = 2 then a_desire when i % 5 = 3 then a_proof else a_mech end,
      case when i % 4 = 0 then h4 when i % 4 = 1 then h1 when i % 4 = 2 then h2 else h3 end,
      case when i <= 7 then cp1 else cp2 end,
      'Resultado com plano, não com chute',
      'Explicamos o processo em 15 segundos e convidamos para a avaliação.',
      case when i <= 7 then 'Agendar avaliação' else 'Quero entrar na turma' end,
      'trocar o hook para uma pergunta direta',
      'aumentar o CTR em 20%',
      'a pergunta ativa reconhecimento do problema nos primeiros 2 segundos',
      'CTR acima de 1,8%',
      case when i % 3 = 0 then 'CTR de 2,1% - hipótese confirmada' else null end,
      case when i % 3 = 0 then 'Bruno' when i % 3 = 1 then 'Júlia' else 'Renata' end,
      case when i % 3 = 0 then 'alta' when i % 3 = 1 then 'media' else 'baixa' end,
      statuses[i],
      array['demo', case when i <= 7 then 'saude' else 'educacao' end],
      'Referências salvas na aba Research.',
      current_date + (i % 10),
      15 + (i % 6), 14 + (i % 7), 10 + (i % 6), 11 + (i % 5), 6 + (i % 5), 5 + (i % 6), 3 + (i % 3), 3 + (i % 3), true)
    returning id into cr;

    insert into public.creative_concepts (workspace_id, creative_id, problem, big_idea, main_message, mechanism, proof, cta, rationale)
    values (ws, cr,'O público investe sem plano e se frustra.','Plano antes de procedimento.','Avaliação é o que separa resultado de sorte.','Protocolo em 3 camadas com simulação digital.','Depoimentos reais e nota 4.9.','Agendar avaliação','Reduz o risco percebido antes de pedir a ação.');

    insert into public.creative_directions (workspace_id, creative_id, format, composition, hierarchy, elements, scenario, characters, style, typography, colors, motion, refs, production_notes)
    values (ws, cr, fmts[i],'Plano médio, rosto no terço superior.','Hook → Prova → Contexto → CTA','Legenda queimada, selo de nota, logo discreto.','Sala real da clínica com luz natural.','Especialista e paciente real.','Documental limpo.','Poppins semibold para hook.','Verde profundo + off-white.','Cortes de 1,2s nos primeiros 3 segundos.','Pasta de referências do projeto.','Gravar em 4K, entregar 9:16 e 1:1.');

    insert into public.creative_versions (workspace_id, creative_id, version, changes, author, comment)
    values (ws, cr, 1, 'Primeira versão produzida a partir do brief.', 'Júlia', 'Base para revisão.');

    if statuses[i] in ('APROVACAO','APROVADO','PUBLICADO','ANALISE','ITERAR') then
      insert into public.approvals (workspace_id, creative_id, status, reviewer, comment)
      values (ws, cr, case when statuses[i] = 'APROVACAO' then 'pendente' else 'aprovado' end, 'Dra. Renata', case when statuses[i] = 'APROVACAO' then 'Aguardando validação do cliente.' else 'Aprovado para veiculação.' end);
    end if;

    insert into public.assets (workspace_id, client_id, project_id, creative_id, name, type, url, width, height, format, tags, is_demo)
    values (ws, case when i <= 7 then c1 else c2 end, case when i <= 5 then p1 when i <= 7 then p2 else p3 end, cr,
      names[i] || ' - master', case when fmts[i] like 'Vídeo%' or fmts[i] = 'Reels' then 'video' else 'imagem' end, null,
      case when fmts[i] like '%9:16%' or fmts[i] = 'Reels' then 1080 else 1080 end,
      case when fmts[i] like '%9:16%' or fmts[i] = 'Reels' then 1920 when fmts[i] like '%4:5%' then 1350 else 1080 end,
      case when fmts[i] like 'Vídeo%' or fmts[i] = 'Reels' then 'mp4' else 'jpg' end, array['demo'], true);

    if statuses[i] in ('PUBLICADO','ANALISE','ITERAR') then
      insert into public.performances (workspace_id, creative_id, client_id, project_id, platform, period_start, period_end, spend, impressions, reach, clicks, lpv, conversions, leads, purchases, revenue, is_demo)
      values (ws, cr, case when i <= 7 then c1 else c2 end, case when i <= 5 then p1 when i <= 7 then p2 else p3 end, plats[i],
        current_date - 14, current_date, 1200 + i*180, 68000 + i*5200, 51000 + i*3100, 900 + i*140, 700 + i*110, 40 + i*3, 40 + i*3, 8 + i, 6000 + i*900, true);
      insert into public.performances (workspace_id, creative_id, client_id, project_id, platform, period_start, period_end, spend, impressions, reach, clicks, lpv, conversions, leads, purchases, revenue, is_demo)
      values (ws, cr, case when i <= 7 then c1 else c2 end, case when i <= 5 then p1 when i <= 7 then p2 else p3 end, plats[i],
        current_date - 28, current_date - 15, 900 + i*120, 42000 + i*3000, 33000 + i*2000, 480 + i*70, 360 + i*50, 22 + i*2, 22 + i*2, 4 + i, 3200 + i*600, true);
    end if;

    insert into public.activities (workspace_id, actor, action, entity_type, entity_id, description)
    values (ws, 'Sistema (demo)', 'criou', 'creative', cr, 'Criativo ' || names[i] || ' criado com dados de demonstração.');
  end loop;

  insert into public.matrix_rows (workspace_id, client_id, project_id, audience, awareness, funnel, angle_id, hook_id, offer, format, platform, hypothesis, status, is_demo) values
   (ws,c1,p1,'Mulheres 28-45 que já pesquisaram harmonização','problem_aware','TOFU',a_pain,h1,'Avaliação gratuita','Reels','Meta','Se abrirmos com uma pergunta sobre o medo de ficar artificial, então o CTR sobe, porque o público reconhece a objeção principal.','oportunidade',true),
   (ws,c1,p2,'Leads que não agendaram em 14 dias','solution_aware','Remarketing',a_obj,h3,'Avaliação gratuita','Estático 1:1','Meta','Se mostrarmos prova social com nota 4.9, então o CVR sobe, porque reduz risco percebido.','planejado',true),
   (ws,c2,p3,'Gestores de tráfego iniciantes','solution_aware','MOFU',a_mech,h4,'Turma 7','Vídeo 9:16','TikTok','Se explicarmos o mecanismo em 15s, então o CPL cai, porque a promessa fica concreta.','oportunidade',true);

  insert into public.research_items (workspace_id, client_id, title, url, source, category, notes, tags, is_demo) values
   (ws,c1,'Clínica referência em comunicação educativa','https://exemplo.com/clinica','Instagram','concorrente','Usa carrossel explicando procedimento passo a passo.', array['demo'],true),
   (ws,c2,'Anúncio de curso com prova em números','https://exemplo.com/curso','Biblioteca de anúncios','referência','Abertura com número de alunos nos 2 primeiros segundos.', array['demo'],true);

  insert into public.insights (workspace_id, client_id, project_id, title, observation, evidence, hypothesis, action, priority, status, is_demo) values
   (ws,c1,p1,'Hook de pergunta performa melhor no frio','Criativos com hook em pergunta tiveram CTR acima da média do projeto.','Comparativo de CTR dos últimos 14 dias.','Se aplicarmos hook de pergunta nos TOFU, então o CTR médio sobe, porque ativa reconhecimento do problema.','Testar 3 variações de hook de pergunta na próxima semana.','alta','aberto',true),
   (ws,c2,p3,'CTR alto e conversão baixa na turma 7','Bom clique, poucas inscrições.','Performance dos criativos publicados.','Se alinharmos a promessa do criativo com a página, então o CVR sobe, porque reduz a quebra de expectativa.','Revisar headline da página de inscrição.','media','em_andamento',true);

  insert into public.notifications (workspace_id, user_id, type, title, body, link) values
   (ws, auth.uid(), 'aprovacao','Criativo aguardando aprovação','Um criativo demo está na etapa de aprovação.','/aprovacoes'),
   (ws, auth.uid(), 'prazo','Prazo próximo','Dois criativos demo vencem nos próximos 3 dias.','/producao');

  insert into public.reports (workspace_id, client_id, project_id, title, period_start, period_end, summary, next_tests, is_demo) values
   (ws,c1,p1,'Relatório demo - Harmonização Facial', current_date - 30, current_date,'Produção estável, CTR acima da média e CPL dentro da meta. Dois criativos vencedores identificados.','Testar hook de pergunta e nova prova social.',true);

  return ws;
end $$;

grant execute on function public.create_workspace_with_demo(text, boolean) to authenticated;