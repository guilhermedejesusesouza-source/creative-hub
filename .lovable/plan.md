# Creative OS — Plano da V1

Sistema completo de operação criativa (planejamento → produção → aprovação → performance → iteração), com banco de dados real, login, multi-workspace e dados de exemplo em português.

## Premissas que assumo (corrija se quiser diferente)
- Backend, login e banco pelo Lovable Cloud (nativo, sem contas externas).
- Login por e-mail e senha, com confirmação automática ligada para não travar o teste.
- Cada pessoa entra em um workspace; todos os dados ficam isolados por workspace.
- Papéis: Admin, Estrategista, Copywriter, Designer, Editor, Gestor de Tráfego e Cliente (o Cliente só vê o que é dele).
- Dados de exemplo marcados com selo "Demo" para você distinguir do que criar.
- Sem integrações reais com Meta/Google/TikTok/Figma nesta etapa: só o espaço preparado para elas.

## Fase 1 — Fundação
- Ativar backend, criar login/cadastro, perfil, workspace e papéis.
- Definir a identidade visual: tema escuro premium, tipografia, cores e componentes base.
- Layout do app: barra lateral recolhível, cabeçalho, busca global por Ctrl/Cmd+K, avisos e notificações.

## Fase 2 — Estrutura de dados e dados demo
Tabelas relacionadas para: workspace, membros, clientes, projetos, produtos, ofertas, briefings, ICP, VOC, ângulos, hooks, copies, criativos, versões, hipóteses, conceitos, direção de arte, assets, referências, aprovações, performance, insights, relatórios, notificações, tags, comentários, iterações, plataformas e campanhas.
- Regras de acesso por workspace em todas as tabelas.
- ID de criativo sequencial por workspace no formato C-000001.
- Dados demo: 2 clientes, 3 projetos, 12 criativos em status variados, ângulos, hooks, copies, assets, performances e insights.

## Fase 3 — Núcleo operacional (o fluxo do critério de aceite)
- Painel executivo: criativos em produção, aguardando aprovação, publicados, CTR, CPC, CPL/CPA, ROAS, vencedores, atenção, gráficos de produção e de performance, ranking e atividades, com filtros.
- Clientes e Projetos: listagem, busca, filtros, criação, edição, exclusão com confirmação e página de detalhe.
- Briefing guiado em 14 etapas, com rascunho e finalização.
- Creative Matrix cruzando público, consciência, funil, ângulo, hook, oferta, formato, plataforma e hipótese, com "criar criativo" direto da linha.
- Bibliotecas de Ângulos e Hooks (categorias, busca, favoritos, copiar).
- Criação de criativo em fluxo guiado com todos os campos, hipótese estruturada, conceito e direção de arte.
- Quadro de Produção (Kanban) com os 12 status, arrastar e soltar, filtros e cartões informativos.
- Versões e Aprovações: aprovar, pedir alteração, rejeitar, comentários e histórico.
- Performance: registro manual por criativo/plataforma/campanha/período, tabela e gráficos.
- Creative Score (0–100 com pesos definidos, detalhamento e recomendações) e Performance Score separado.
- Creative Intelligence: diagnósticos por regras com explicação e ação sugerida.
- Insights e botão Iterar (duplica o criativo mudando uma variável, com árvore de iterações).

## Fase 4 — Complementos
- Copy Library, Creative Library, Assets, Relatórios, Research e Configurações (workspace, membros, papéis, tags, integrações preparadas).
- Onboarding inicial: criar workspace, primeiro cliente, projeto e briefing.

## Fase 5 — Revisão
- Percorrer o fluxo ponta a ponta no app rodando, conferir estados de carregando/vazio/erro, validações, avisos e links, e corrigir o que estiver quebrado.

## Notas técnicas
- TanStack Start + React + Tailwind + shadcn/ui; rotas protegidas sob `_authenticated`, rotas públicas para entrada e login.
- Leitura/escrita via server functions autenticadas; RLS por workspace com função de papel em tabela separada.
- Enums e status centralizados em um módulo de domínio; hooks de dados com TanStack Query; serviços de integração como interfaces vazias documentadas.

## Entrega
Faço as fases em sequência, começando pela 1 e 2 nesta mesma etapa. Cada fase entrega telas navegáveis de verdade, não maquetes.
