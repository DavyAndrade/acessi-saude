# AGENTS.md — AcessiSaúde-Audit

## Project Overview
MVP de auditoria contínua de acessibilidade web (WCAG 2.1 A/AA + LBI) para plataformas públicas de saúde (e-SUS, Conecte SUS, agendamentos municipais).

## Current State
- **Stack**: Not yet defined (early MVP)
- **No package.json, build, test, or lint config exists**
- **No CI/CD pipeline**

## Local Agents (`.opencode/agent/`)
| Agent | Purpose | Invocation |
|-------|---------|------------|
| `cavecrew-investigator` | Read-only code locator (file:line tables) | "delegate to cavecrew-investigator: find X" |
| `cavecrew-builder` | Surgical 1-2 file edits | "use cavecrew-builder to fix Y in Z" |
| `cavecrew-reviewer` | Diff/PR review (one line per finding) | "spawn cavecrew-reviewer for this diff" |

## Conventions
- Agents output caveman-compressed format (~60% token reduction)
- Use `cavecrew` skill for delegation guidance
- Ponytail mode active (ultra) — favor deletion, stdlib, native features

## Next Steps (when code exists)
- Define tech stack (scraper: Playwright/Puppeteer? aXe-core for WCAG?)
- Add package.json with lint/typecheck/test scripts
- Configure CI (GitHub Actions)
- Document run/test commands here