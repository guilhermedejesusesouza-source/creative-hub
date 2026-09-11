# Roadmap — Creative OS

## Em andamento
- [ ] Telas restantes do app: biblioteca criativa, configurações; revisão ponta a ponta (build + fluxo)
- [ ] Importação/exportação CSV/XLSX (clientes, leads, tarefas, performance)
- [ ] Briefings, ângulos, hooks, copy library, Creative Matrix, assets, research, relatórios
- [ ] Reuniões, onboarding, processos, rotinas de tráfego (telas)

## Concluído
- [x] Banco de dados Creative OS + CRM (RLS por workspace, dados demo)
- [x] Identidade visual, shell com sidebar, busca CMD/K, notificações
- [x] Autenticação, workspace, onboarding inicial
- [x] Dashboard, clientes + Customer 360, leads/pipeline, follow-ups, tarefas
- [x] Projetos, criativos + detalhe (score, versões, aprovação, iteração), Production Board
- [x] Performance e Insights/Diagnósticos

## Próximo módulo — AI Agents (pedido em 11/09)
### P0
- [ ] Infra: tabelas AIAgent, AIAgentExecution, AIConversation, AIMessage, AIAction, AIPrompt, AIUsage, BrandVoice, AgentMemory, AgentAuditLog (isolamento por workspace)
- [ ] Context Builder (cliente/lead/tarefas/performance) + saída estruturada validada
- [ ] AI Hub com cards dos 12 agentes (status, execuções, atalhos, histórico)
- [ ] AI Assistant global (CMD/CTRL+J) com contexto da página e comandos /
- [ ] Agentes: Comercial (abordagem 3 variações, objeções), Follow-up, Atendimento, Reunião (preparar/processar), Operações (plano do dia), Copy, Criativos
- [ ] AI Action Center (contexto, evidência, recomendação, executar/ignorar/adiar)
- [ ] Níveis de permissão 1–4 com confirmação humana e log de auditoria

### P1
- [ ] Agentes: Onboarding, Gestão de Tráfego, Relatórios, Inteligência Comercial, Client Intelligence
- [ ] AI Playbooks, Brand Voice por cliente, Prompt Library, AI History, AI Usage

### P2
- [ ] Integrações externas (WhatsApp, e-mail, Meta/Google Ads, Slack, Drive, Figma) e automações avançadas

## Pendências técnicas
- [ ] Aviso do linter do banco: função SECURITY DEFINER executável por usuários autenticados
