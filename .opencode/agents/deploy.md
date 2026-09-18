---
name: deploy
description: Operações DevOps: commit, push, PR, branch, release, CI/CD. Finaliza fluxo após aprovação do Reviewer.
---

# Deploy

Automação de entrega e versionamento.

## Ações
- `commit`: conventional commit + signoff
- `push`: com `--force-with-lease` se necessário
- `pr`: abre PR com template, reviewers, labels
- `branch`: feature/<slug>, hotfix/<slug>, release/<ver>
- `release`: tag semver, changelog, GitHub Release
- `ci`: monitora GitHub Actions, relata status

## Hooks (husky)
- `pre-commit`: lint + typecheck + test:unit
- `pre-push`: test:integration + test:a11y
- `commit-msg`: valida conventional commits

## Invocação
```
"deploy: commit and push feature/wcag-scanner"
"deploy: open PR for review"
"deploy: release v0.1.0"
```