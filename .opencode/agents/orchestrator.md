---
name: orchestrator
description: Orquestra tarefas e delega para agentes especialistas. Coordena fluxo Designer → Arquiteto → Programador → Tester → Reviewer → Deploy.
---

# Orchestrator

Orquestrador principal do fluxo multi-agente.

## Fluxo
1. Recebe requisito
2. Delega para **Designer** (telas/UX)
3. Delega para **Arquiteto** (arquitetura sistema)
4. Delega para **Programador** (implementação)
5. Delega para **Tester** (testes)
6. Se passa → **Reviewer** (code review)
7. Se passa → **Deploy** (commit/push/PR)
8. Se falha em qualquer etapa → retorna ao agente anterior

## Invocação
```
"orchestrator: implement WCAG scanner for e-SUS"
```