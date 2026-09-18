# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + Vite + Tailwind (user-confirmed)

## Users

**Primary:** Public health auditor — government auditor reviewing e-SUS, Conecte SUS, and municipal scheduling portal compliance for legal reporting under LBI (Lei 13.146/2015). They run scheduled audits, review violation reports, map findings to legal articles, and produce compliance evidence for oversight bodies.

**Secondary:** Accessibility/product leads tracking org-wide a11y health; legal/compliance officers mapping violations to LBI articles for risk assessment.

## Product Purpose

Continuous WCAG 2.1 A/AA audit dashboard purpose-built for Brazilian public health platforms. Automates scanning of e-SUS, Conecte SUS, and municipal scheduling portals; surfaces violations with code-level context; maps each finding to LBI legal requirements; tracks regression over time; exports audit-ready evidence packages.

Success = auditor completes a full compliance review in minutes instead of days, with legally defensible evidence linking each technical violation to its LBI article.

## Positioning

Only audit tool pre-configured for Brazil's public health platform ecosystem (e-SUS, Conecte SUS, municipal agendamentos) with built-in LBI (Lei 13.146) legal mapping. Generic tools (aXe, WAVE, Lighthouse) require manual configuration per portal and lack legal mapping.

## Operating Context

- Auditor runs scheduled scans (daily/weekly) via CLI or CI/CD
- Reviews dashboard: violation list → detail → legal mapping → export
- Evidence package: PDF/JSON with screenshots, code snippets, LBI article references
- Workflow integrates with existing gov audit processes (TCU, CGU, MP frameworks)
- Portals are JS-heavy, require authenticated sessions, have complex multi-step flows

## Capabilities and Constraints

**Confirmed:**
- CLI scanner (Playwright + axe-core) exists at `src/audit.ts`
- Reports saved as JSON to `reports/`
- WCAG 2.1 A/AA tags via axe-core
- Bun runtime, TypeScript strict, Vitest/Playwright tests
- Husky pre-commit: lint + typecheck + unit tests

**Constraints:**
- Dashboard reads `reports/*.json` (no backend yet)
- Must be WCAG 2.1 AA compliant itself
- Portuguese-first UI (auditor language)
- Mobile-responsive for field review

**Undecided:**
- Authentication/multi-user
- Historical trend charts backend
- CI/CD integration spec
- Real-time vs scheduled scan UI

## Brand Commitments

Name: **AcessiSaúde-Audit** (established in README)
Voice: Technical, precise, legally grounded, accessible
No pre-existing visual identity, logo, or palette — greenfield

## Evidence on Hand

- `src/audit.ts` — working CLI scanner with Playwright + axe-core
- `reports/*.json` — sample audit outputs (example.com, google.com)
- `docs/design/dashboard.md` — initial spec from Designer agent
- Lazyweb references: Vanta (compliance), Cycode (multi-viz), Deel (task cards), Miro (a11y sidebar), AppCanary (severity table), LTSE (regulatory table)

## Product Principles

1. **Legal-first** — every technical finding maps to LBI article; evidence is court-ready
2. **Health-portal native** — pre-configured for e-SUS/Conecte SUS/municipal flows; zero config for target domains
3. **Auditor workflow** — scan → review → map → export in minimal clicks; no dashboard fluff
4. **Self-accessible** — dashboard meets WCAG 2.1 AA; dogfoods its own standard
5. **Peripheral-aware** — scores reflect low-bandwidth, screen-reader, mobile-first reality of SUS users

## Accessibility & Inclusion

- Dashboard must pass WCAG 2.1 AA (audits itself)
- Portuguese (pt-BR) primary; Libras glossary for key terms
- High contrast mode, reduced motion, zoom to 200% without horizontal scroll
- Screen reader optimized: landmarks, heading hierarchy, live regions for scan progress
- Keyboard-only navigation for all actions