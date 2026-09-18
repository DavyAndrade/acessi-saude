# Roadmap — AcessiSaúde-Audit

Planejamento de evolução da ferramenta de auditoria de acessibilidade para plataformas de saúde pública.

---

## 📍 Fase 1: MVP Funcional (Concluído ✅)
- [x] CLI de varredura com Playwright + axe-core (`src/audit.ts`).
- [x] Suporte a regras WCAG 2.1 A e AA.
- [x] Persistência de relatórios em formato JSON estruturado (`reports/`).
- [x] Frontend Dashboard desenvolvido em Vite + React + TypeScript + Tailwind + shadcn/ui.
- [x] Tabela/Cards responsivos para listagem de auditorias.
- [x] Filtros por severidade, conformidade WCAG, busca textual e datas.
- [x] Mapeamento direto de violações técnicas para artigos da **Lei Brasileira de Inclusão (Lei nº 13.146/2015)**.
- [x] Exportação de dados (JSON, CSV e base para PDF).
- [x] Pipeline de CI local com Husky, ESLint e TypeScript strict.

---

## 📍 Fase 2: Robustez & Automação de Varredura (Em Andamento / Próximos Passos 🚀)
- [ ] **Simulação de Fluxos Autenticados (e-SUS / Gov.br)**:
  - Suporte a login simulado ou injeção de sessão/cookies no CLI para auditar áreas restritas de prontuário e agendamento.
- [ ] **Métricas de Impacto Periférico**:
  - Medição de consumo de dados (payload/rede em 3G/4G simulado).
  - Cálculo de índice de sobrecarga cognitiva e latência de carregamento para dispositivos de baixo custo.
- [ ] **Evolução da Exportação de Relatórios Jurídicos**:
  - Geração de parecer técnico/jurídico em PDF com layout pronto para anexação em processos do Ministério Público (MP), Defensoria e órgãos de controle (TCU/CGU).
- [ ] **Configuração de Suíte de Testes de Integração E2E**:
  - Setup de Playwright E2E para o dashboard frontend.
  - Correção dos testes de integração para liberar pre-push hook estrito.

---

## 📍 Fase 3: Monitoramento Contínuo & Agendamento
- [ ] **Auditorias Agendadas via Cron/CI**:
  - Execução periódica automatizada (GitHub Actions / cron jobs) contra endpoints públicos de saúde.
- [ ] **Histórico Temporal e Gráficos de Tendência**:
  - Visualização de evolução da conformidade ao longo do tempo (regressão de acessibilidade).
  - Comparativo entre portais municipais e estaduais (ex: Rio de Janeiro vs. capitais).
- [ ] **Alertas de Regressão**:
  - Notificações (Webhook/Discord/E-mail) em caso de introdução de falhas críticas (ex.: botões sem rótulo, formulários inacessíveis).

---

## 📍 Fase 4: Expansão Científica & Interdisciplinar
- [ ] **Exportação de Dados para Pesquisa Científica**:
  - Exportação agregada em formato compatível com R/Pandas para análise estatística acadêmica.
- [ ] **Suporte a Diretrizes Adicionais**:
  - eMAG (Modelo de Acessibilidade em Governo Eletrônico).
  - WCAG 2.2 (novos critérios de foco, tamanho de alvo e entrada redundante).
- [ ] **Glossário e Suporte a Libras**:
  - Tradução e contextualização de termos técnicos para a comunidade surda e gestores públicos.