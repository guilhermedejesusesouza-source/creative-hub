# Creative Hub

Crie um SaaS full-stack chamado **Creative OS**, um sistema profissional para planejamento, criação, produção, aprovação, publicação, análise e otimização de criativos para social media e tráfego pago.

OBJETIVO DO PRODUTO
O Creative OS deve transformar o processo: Briefing → Diagnóstico → Estratégia → Ângulo → Hook → Copy → Conceito → Direção Criativa → Produção → QA → Aprovação → Publicação → Performance → Inteligência → Iteração. A V1 deve ser realmente navegável e funcional, com banco de dados, CRUDs, estados, filtros, busca, formulários, Kanban, dashboards e dados demo coerentes. Não faça apenas uma landing page/mockup.

STACK E ARQUITETURA
- Use o stack full-stack padrão do Lovable, TypeScript, React, Tailwind e shadcn/ui.
- Use backend/database/auth de forma nativa e preparada para produção.
- Estruture o código em componentes reutilizáveis, hooks, services e tipos bem definidos.
- Arquitetura preparada para futuras integrações com Meta Ads, Google Ads, TikTok Ads, Figma, Google Drive, Slack, WhatsApp, webhooks e IA.
- Não invente integrações reais: onde não houver conexão, use dados demo claramente identificados e deixe interfaces/serviços preparados.
- Multi-tenant: dados devem ser isolados por workspace/organização.
- Autenticação e permissões por papel.

UX/UI
Crie uma interface premium de SaaS B2B, moderna, limpa e muito profissional, com estética dark SaaS sofisticada, excelente hierarquia visual, tipografia consistente, cards, tabelas, badges, filtros, drawers/modais, tabs, breadcrumbs, tooltips, empty states, skeleton loading, toasts e feedback visual.
Layout principal com sidebar recolhível, header, busca global CMD/CTRL+K e área de conteúdo. Deve ser responsivo para desktop, tablet e mobile. Priorize usabilidade para uma operação diária de agência/tráfego.

NAVEGAÇÃO PRINCIPAL
1. Dashboard
2. Clientes
3. Projetos
4. Creative Matrix
5. Criativos
6. Briefings
7. Ângulos
8. Hooks
9. Copy Library
10. Creative Library
11. Assets
12. Production Board
13. Aprovações
14. Performance
15. Creative Intelligence
16. Insights
17. Relatórios
18. Research
19. Configurações

DASHBOARD
Mostrar visão executiva e operacional:
- Criativos em produção
- Aguardando aprovação
- Publicados
- CTR médio
- CPC médio
- CPL/CPA
- ROAS
- Criativos vencedores
- Criativos que precisam de atenção
- Gráfico de produção por status
- Gráfico de performance ao longo do tempo
- Ranking de melhores criativos
- Feed de atividades recentes
- Filtros por cliente, projeto, período e plataforma.

CLIENTES E PROJETOS
Clientes com nome, empresa, segmento, contato, status, marca, identidade visual e observações.
Projetos vinculados a cliente com produto/serviço, objetivo, plataforma, funil, período, status e responsáveis.
Permitir CRUD, busca, filtros e visualização detalhada.

MASTER BRIEF
Criar briefing guiado em múltiplas etapas:
1. Negócio
2. Produto/Serviço
3. Oferta
4. Objetivo/KPI
5. Público/ICP
6. VOC (Voice of Customer)
7. Nível de consciência
8. Funil
9. Copy/mensagem
10. Identidade da marca
11. Direção visual
12. Formatos/plataformas
13. Referências
14. Restrições
Salvar como rascunho e finalizar.
Níveis de consciência: Unaware, Problem Aware, Solution Aware, Product Aware, Most Aware.
Funil: TOFU, MOFU, BOFU, Remarketing.

CREATIVE MATRIX
Criar uma matriz cruzando:
- Público
- Nível de consciência
- Funil
- Ângulo
- Hook
- Oferta
- Formato
- Plataforma
- Hipótese
Permitir gerar/organizar oportunidades e abrir um novo criativo diretamente da matriz.

ÂNGULOS
Biblioteca com categorias: Pain, Desire, Benefit, Mechanism, Error, Objection, Proof, Comparison, Demonstration, Offer, Novelty, Contrarian.
Cada ângulo deve possuir nome, categoria, descrição, quando usar, exemplos e tags.

HOOKS
Biblioteca pesquisável de hooks com categorias como curiosidade, dor, benefício, prova, contraste, pergunta, quebra de padrão, urgência e autoridade.
Permitir favoritar, copiar e vincular a criativos.

COPY LIBRARY
Biblioteca de copies reutilizáveis por cliente/projeto/campanha, com headline, primary text, CTA, formato, estágio de funil, nível de consciência, tags e performance relacionada.

CRIAÇÃO DE CRIATIVO
Criar fluxo guiado:
Brief → Estratégia → Hipótese → Ângulo → Hook → Copy → Conceito → Direção → Produção.
Cada criativo deve possuir ID automático no formato C-000001.
Campos principais:
- nome
- cliente
- projeto
- produto
- oferta
- plataforma
- formato
- objetivo
- funil
- nível de consciência
- ângulo
- hook
- copy
- CTA
- hipótese
- conceito
- direção criativa
- responsável
- prioridade
- status
- tags
- referências

HIPÓTESE
Estruturar cada hipótese como:
"Se [mudança], então [resultado esperado], porque [mecanismo/insight]."
Permitir registrar expectativa e resultado real.

CONCEITO E DIREÇÃO CRIATIVA
O Creative Concept deve conter problema/oportunidade, big idea, mensagem principal, mecanismo, prova, CTA e racional.
A Art Direction deve conter formato, composição, hierarquia visual, elementos, cenário, personagens, estilo, tipografia, cores, motion, referências e observações de produção.
Aplicar princípio de hierarquia: Hook → Prova/Benefício → Contexto → CTA.

PRODUCTION BOARD
Kanban com os status:
BACKLOG → BRIEFING → ESTRATÉGIA → COPY → DIREÇÃO → PRODUÇÃO → REVISÃO → APROVAÇÃO → APROVADO → PUBLICADO → ANÁLISE → ITERAR.
Drag-and-drop quando viável. Cada card mostra ID, nome, cliente, formato, responsável, prioridade, prazo e thumbnail.
Filtros por cliente, projeto, responsável, plataforma, prioridade e prazo.

VERSÕES E APROVAÇÃO
Todo criativo deve suportar versões. Registrar versão, alterações, autor, data e comentário.
Fluxo de aprovação com aprovar, solicitar alteração, rejeitar e comentários.
Histórico de aprovação e atividade.
Permissões:
- Admin
- Strategist
- Copywriter
- Designer
- Editor
- Traffic Manager
- Client
O cliente deve ter acesso somente ao que lhe pertence e ações permitidas.

CREATIVE LIBRARY E ASSETS
Biblioteca visual de criativos publicados/em produção, com thumbnails, filtros, tags e metadados.
Assets com nome, tipo, URL/path, dimensões, formato, cliente, projeto, tags e versão.
Permitir vincular assets a criativos e direções.

PERFORMANCE
Registrar dados por criativo, plataforma, campanha e período:
Impressions, Reach, CPM, Clicks, CTR, CPC, LPV, Conversions, CVR, Leads, CPL, Purchases, CPA, Revenue, ROAS.
Criar tela de performance com filtros, tabela e gráficos.
Preparar modelo para importação futura via API.

CREATIVE SCORE
Calcular score de qualidade de 0 a 100 usando:
- Clarity of offer 20
- Hook 20
- Visual hierarchy 15
- Audience relevance 15
- Differentiation 10
- Proof/credibility 10
- CTA 5
- Platform fit 5
Mostrar score, breakdown e recomendações.

PERFORMANCE SCORE
Criar score separado para desempenho baseado nos dados disponíveis. Não confundir qualidade criativa com performance.

CREATIVE INTELLIGENCE
Criar rankings e diagnósticos automáticos com base nos dados cadastrados.
Exemplos de regras:
- CTR baixo → provável problema de hook/conceito
- CTR alto + CVR baixo → desalinhamento entre promessa, oferta e landing page
- CTR alto + CPA baixo → potencial vencedor
- CPM alto → investigar audiência/posicionamento
- CPC alto com CTR baixo → revisar hook e relevância
- Boa performance com baixo volume → oportunidade de escala/teste
Mostrar explicações e ações sugeridas, sem afirmar causalidade absoluta.

INSIGHTS E ITERAÇÃO
Permitir criar insight com título, observação, evidência, hipótese, ação recomendada, prioridade, status e vínculo a criativos.
Botão "Iterar" deve permitir duplicar um criativo vencedor e criar nova versão/variação alterando apenas uma variável: hook, ângulo, oferta, visual, CTA, prova, formato etc.
Registrar árvore de iterações e parent/child creative.

RELATÓRIOS
Criar relatório por cliente/projeto/período com resumo executivo, volume produzido, aprovados, publicados, melhores criativos, métricas, insights e próximos testes. Permitir visualizar e preparar exportação futura.

RESEARCH
Biblioteca para referências e pesquisa: URL, título, fonte, categoria, notas, tags, screenshot/asset quando disponível e criativos relacionados.

BUSCA E NOTIFICAÇÕES
Busca global CMD/CTRL+K para clientes, projetos, criativos, briefings, hooks, ângulos e assets.
Notificações para aprovação solicitada, alteração solicitada, prazo próximo e novas atividades.

MODELO DE DADOS
Crie entidades/tabelas relacionadas para pelo menos:
User, Organization/Workspace, Client, Project, Product, Offer, Brief, ICP, VOCItem, Angle, Hook, CopyItem, Creative, CreativeVersion, CreativeHypothesis, CreativeConcept, CreativeDirection, Asset, Reference, Approval, Performance, Insight, Report, Notification, Tag, Comment, Iteration, Platform, Campaign.
Use IDs/foreign keys e timestamps. Inclua created_at/updated_at quando apropriado.

REGRAS DE NEGÓCIO
- Um cliente possui vários projetos.
- Um projeto possui produtos/ofertas, briefings e criativos.
- Um criativo pertence a um projeto e pode possuir várias versões, assets, aprovações, performances, insights e iterações.
- Creative ID é único e sequencial dentro da organização.
- Dados devem ser filtráveis por organização/cliente/projeto.
- Status e enums devem ser centralizados.
- Não perder dados ao navegar ou atualizar.

ONBOARDING
Ao entrar pela primeira vez, mostrar onboarding curto para criar organização, primeiro cliente, primeiro projeto e primeiro briefing. Depois apresentar dashboard com dados demo ou dados reais cadastrados.

DEMO DATA
Inclua dados demo realistas em português do Brasil: pelo menos 2 clientes, 3 projetos, 10+ criativos em diferentes status, ângulos, hooks, copies, assets, performances e insights. Deixe claro quando algo é dado demo.

QUALIDADE
- Estados de loading, erro e vazio.
- Validação de formulários.
- Toasts de sucesso/erro.
- Confirmação antes de ações destrutivas.
- Não usar lorem ipsum.
- Não criar telas quebradas ou links sem destino.
- Todos os botões principais devem executar alguma ação funcional na V1.
- Desktop first, mas responsivo.
- Acessibilidade básica: labels, foco, contraste, navegação por teclado.
- Performance: paginação/listagem eficiente e componentes reutilizáveis.

PRIORIZAÇÃO DA V1
P0: autenticação/workspace, dashboard, clientes, projetos, briefing, criativos, matriz, ângulos, hooks, produção Kanban, aprovação, performance, Creative Score, Creative Intelligence básica, busca, banco de dados e demo data.
P1: biblioteca de assets, copy library, insights, iteração/versionamento, relatórios e research.
P2: integrações externas, automações avançadas e agentes de IA.

IMPORTANTE SOBRE IA E INTEGRAÇÕES
Não tente construir todas as integrações externas agora. Primeiro entregue uma V1 sólida, navegável e funcional com arquitetura preparada para elas. Onde uma integração não existir, crie a interface/serviço preparado, mas não simule que dados externos são reais.

CRITÉRIO DE ACEITE
Eu preciso conseguir entrar no sistema, criar cliente, criar projeto, preencher briefing, escolher ângulo/hook, criar um criativo, acompanhar no Kanban, enviar para aprovação, aprovar, registrar performance, visualizar Creative Score, receber um diagnóstico, criar insight e iterar o criativo. Esse fluxo deve funcionar ponta a ponta.

Comece pela V1 funcional e implemente de verdade banco, autenticação, rotas, componentes e operações CRUD. Não pare em wireframes. Depois de implementar, faça uma revisão interna das rotas principais, estados e fluxo ponta a ponta para corrigir erros óbvios.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d3264fa2-7484-4f9a-9b5f-76230f2349b8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
