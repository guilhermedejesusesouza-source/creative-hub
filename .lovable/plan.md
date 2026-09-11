# Creative OS — CRM, Clientes e Central Operacional

## Ponto de partida real (verificado agora)

O banco de dados do Creative OS já existe (clientes, projetos, briefings, ângulos, hooks, copies, criativos, versões, aprovações, assets, performance, insights, relatórios, notificações, atividades, workspaces com regras de acesso).

As telas ainda **não** existem: `src/routes` tem apenas a página inicial em branco. Portanto este plano entrega o app inteiro navegável — com o CRM já integrado desde o início, e não como um segundo sistema.

## Nova identidade visual (feita primeiro, uma vez)

Paleta única aplicada a tudo: preto estrutural, off-white para leitura, verde esmeralda como cor primária, verde neon apenas como destaque pontual (CTA principal, "vencedor", alta performance). Tokens centrais de cor, espaçamento, borda, sombra, tipografia e estados. Sem cores soltas nas telas.

## Entregas por fase

### Fase 1 — Base do app
- Entrar e criar conta (e-mail/senha + Google), criação do workspace, dados de demonstração.
- Estrutura fixa: barra lateral com os grupos Workspace / CRM / Operação / Creative OS / Intelligence / Recursos / Sistema, cabeçalho com busca e central de notificações (Hoje, Atrasadas, Importantes, Todas).
- Componentes reaproveitados: tabela com filtros e ordenação, Kanban arrastável, cards, timeline, calendário, painéis de detalhe, estados vazios e de carregamento, confirmações.

### Fase 2 — Clientes e Customer 360
- Lista de clientes em cards e tabela: Cliente | Status | Serviço | Valor mensal | Responsável | Última atividade | Próxima tarefa | Saúde.
- Todos os campos comerciais e de contato pedidos; 12 status com cor própria; prioridade e tags.
- Página do cliente com abas: Visão geral, Atividades (timeline), Tarefas, Projetos, Criativos, Performance, Financeiro (só campos), Observações, Gestão de Tráfego, Onboarding.
- Observações com título, conteúdo, categoria, prioridade, autor, tags e opção de fixar no topo.
- Saúde do cliente (Saudável / Atenção / Risco) com explicação dos sinais que levaram ao status — apresentada como indício, não como causa provada.

### Fase 3 — Leads, pipeline e follow-ups
- Pipeline com as 22 etapas (Lead, Abordado 1–7, Qualificação, Reunião, Proposta, Follow-up 1–7, Negociação, Fechado, Perdido, Em Nutrição) em Kanban e tabela.
- Cabeçalho de cada etapa com nº de leads, valor potencial, conversão, tempo médio, leads parados e sem próxima ação.
- Página do lead com todos os campos pedidos, score 0–100 (Hot/Warm/Cold) e dor, necessidade, orçamento, urgência e fit.
- Controle dos 7 contatos: indicador "Contato 3 de 7", botão Registrar contato (data, canal, resultado, mensagem, resposta, observação) e sugestão automática da próxima data, editável.
- Follow-ups numerados com status Pendente / Hoje / Atrasado / Concluído / Cancelado e alertas de atraso.
- Perdido abre modal obrigatório de motivo (lista configurável) + observação, com data e responsável; relatório de motivos de perda.
- Em Nutrição com motivo, próximo contato, interesse e potencial futuro, com lembrete de revisão.

### Fase 4 — Tarefas, reuniões, onboarding, processos, tráfego
- Central de tarefas com visões Hoje, Próximas, Atrasadas, Semana, Kanban, Lista e Calendário; todos os campos, tipos, checklist e recorrência (diária, semanal, quinzenal, mensal, personalizada).
- Reuniões com pauta, anotações, decisões e próximas ações, que geram tarefas em um clique.
- Onboarding com as etapas sugeridas (Comercial, Acessos, Estratégia, Produção, Configuração, Go Live) e percentual de progresso.
- Biblioteca de processos com checklist, prazo padrão e recorrência, e botão para gerar as tarefas do processo.
- Rotinas de tráfego (diária, semanal, mensal) por cliente, personalizáveis.

### Fase 5 — Importação e exportação
- Importar dados em CSV e XLSX em 7 etapas: upload, detecção de colunas, mapeamento editável, validação, tratamento de duplicados (por e-mail, telefone, CNPJ, nome+empresa) com Ignorar / Atualizar / Criar novo, progresso e resultado (importados, atualizados, ignorados, erros).
- Peças reutilizáveis para outras entidades no futuro: upload, mapeador, prévia, detector de duplicados, validador, progresso, resultado.
- Exportar clientes, leads, pipeline, tarefas, atividades, performance e relatórios em CSV e XLSX, respeitando os filtros da tela.

### Fase 6 — Creative OS (telas do fluxo criativo)
Creative Matrix, Criativos e detalhe, Briefings, Ângulos, Hooks, Copy Library, Creative Library, Production Board (Kanban por status), Aprovações — tudo ligado ao mesmo cliente.

### Fase 7 — Dashboard, inteligência e automações
- Dashboard como central de comando: saudação, cards (tarefas hoje/atrasadas, follow-ups hoje/atrasados, leads quentes, propostas abertas, clientes ativos, clientes em atenção), bloco "Minha agenda de hoje" com Atrasado / Hoje / Próximos, funil comercial, clientes que precisam de atenção, operação em andamento e bloco Creative OS.
- CRM Intelligence: conversão por etapa, origem, responsável e segmento, ticket médio, receita potencial e fechada, tempo médio de fechamento, média de contatos até reunião e de follow-ups até fechamento, motivos de perda, leads parados e em nutrição.
- Notificações e automações: reunião cria tarefa de preparação, proposta cria follow-up, fechado inicia onboarding, perdido pede motivo, cliente em onboarding recebe checklist, tarefa/follow-up atrasado gera alerta.
- Prioridade automática Urgente / Alta / Média / Baixa nas listas de ação.

## Notas técnicas

- Novas tabelas: leads, lead_stages, lead_contacts, lead_activities, follow_ups, loss_reasons, client_notes, client_health_snapshots, tasks, task_checklist_items, task_recurrences, meetings, meeting_actions, processes, process_steps, onboardings, onboarding_steps, crm_sources, pipelines, pipeline_stages, automations, automation_rules, import_jobs, import_mappings, import_errors.
- `clients`, `projects`, `creatives`, `activities` e `notifications` existentes são estendidos com colunas novas — nada é duplicado. Tudo se conecta pelo mesmo `client_id`, e um lead fechado vira cliente mantendo histórico via `lead_id` no cliente.
- Toda tabela nova segue o padrão atual: isolamento por workspace, permissões por membro, `created_at`/`updated_at`.
- Automações e recorrências rodam por gatilhos no banco e por funções de servidor; parsing de CSV/XLSX e geração de exportações no servidor.
- Estados derivados (atrasado, hoje, saúde, score, progresso de onboarding) calculados em consultas/views para não ficarem desatualizados.

## Fora de escopo agora

Sistema financeiro completo (só os campos), integração automática com contas de anúncio, e-mail/WhatsApp automatizados.
