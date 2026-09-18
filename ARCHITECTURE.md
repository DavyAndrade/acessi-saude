# Architecture Overview

## System Context

```
┌─────────────────────────────────────────────────────────────────┐
│                        AcessiSaúde-Audit                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │   CLI        │      │   Frontend   │      │   Reports    │  │
│  │   Scanner    │─────►│   Dashboard  │◄────►│   (JSON)     │  │
│  │  (Playwright │      │  (React +    │      │  + Manifest  │  │
│  │   + axe)     │      │   Vite +     │      │              │  │
│  └──────────────┘      │   Tailwind)  │      └──────────────┘  │
│         │              └──────────────┘             ▲           │
│         │                     │                     │           │
│         ▼                     ▼                     │           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Build Pipeline                        │   │
│  │  1. CLI scans target URLs                               │   │
│  │  2. Reports/*.json generated                            │   │
│  │  3. Build script copies to frontend/public/reports/     │   │
│  │  4. Manifest.json generated (index of all reports)      │   │
│  │  5. Vite builds static assets to dist/                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Components

### CLI Scanner (`src/audit.ts`)
- **Runtime**: Bun
- **Engine**: Playwright (Chromium) + axe-core
- **Output**: JSON reports in `reports/` with WCAG 2.1 A/AA violations
- **Features**: Authenticated sessions, multi-page flows, custom viewport

### Frontend Dashboard (`frontend/`)
- **Framework**: React 18 + Vite + TypeScript (strict)
- **Styling**: Tailwind CSS + shadcn/ui (17 components)
- **State**: React Context + custom hooks (no external state lib)
- **Data Loading**: Build-time manifest + runtime lazy loading
- **Accessibility**: WCAG 2.1 AA compliant (semantic HTML, ARIA, keyboard nav, focus mgmt)

### Build System
- **CLI**: `bun run audit <url>` → `reports/`
- **Manifest**: `bun run scripts/build-manifest.ts` → `frontend/public/reports/manifest.json`
- **Frontend**: `cd frontend && bun run build` → `frontend/dist/`
- **Deploy**: Static hosting (any CDN, Netlify, Vercel, GitHub Pages)

## Data Flow

```
Audit Execution                    Dashboard Runtime
─────────────────                  ─────────────────
1. bun run audit url               1. fetch /reports/manifest.json
2. Playwright loads page           2. Render AuditList (summary only)
3. axe-core scans DOM              3. User clicks row
4. JSON → reports/                 4. fetch /reports/{filename}.json
5. Manifest generated              5. Render ViolationDetail
```

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| No backend | MVP reads local JSON; zero infra; auditors run offline |
| Manifest + lazy load | Avoids loading 500+ violations upfront; fast initial paint |
| shadcn/ui | Accessible primitives; copy-paste customizable; no runtime deps |
| React Context | Simple, sufficient for single-user dashboard |
| pt-BR first | Primary users are Brazilian government auditors |
| Dark-first design | Reduces eye strain during long audit sessions |

## File Structure (High-Level)

```
├── src/
│   └── audit.ts              # CLI scanner entry
├── frontend/
│   ├── src/
│   │   ├── components/       # UI components (audit/, layout/, ui/)
│   │   ├── hooks/            # useReports, useFilters, useViolations
│   │   ├── context/          # AuditContext, FilterContext
│   │   ├── types/            # TypeScript interfaces
│   │   ├── utils/            # date, severity, lbi, export helpers
│   │   └── pages/            # AuditDashboard
│   ├── scripts/
│   │   └── build-manifest.ts # Build-time report indexer
│   └── public/reports/       # Served at runtime
├── reports/                  # CLI output (gitignored)
└── docs/architecture/        # Detailed specs
```

## Future Extensibility Points

1. **Backend API** — Replace manifest with API for multi-user, auth, history
2. **Real-time scans** — WebSocket progress updates from CLI
3. **Trend database** — Persist violations over time for regression charts
4. **CI/CD integration** — GitHub Actions/GitLab CI templates
5. **Multi-tenant** — Organizations, projects, role-based access

---

*For detailed frontend architecture, see `docs/architecture/dashboard.md`*