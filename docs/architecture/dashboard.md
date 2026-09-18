# AcessiSaúde Dashboard — Frontend Architecture

## 1. Project Structure

```
frontend/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── components.json              # shadcn/ui config
├── public/
│   └── reports/                 # CLI scanner outputs (copied at build)
├── src/
│   ├── main.tsx                 # Entry point
│   ├── App.tsx                  # Root component
│   ├── index.css                # Tailwind + design tokens
│   ├── vite-env.d.ts
│   │
│   ├── components/
│   │   ├── ui/                  # shadcn/ui primitives (generated)
│   │   │   ├── button.tsx
│   │   │   ├── table.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── select.tsx
│   │   │   ├── date-picker.tsx
│   │   │   ├── card.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── accordion.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── toast.tsx
│   │   │   └── label.tsx
│   │   │
│   │   ├── audit/
│   │   │   ├── AuditList.tsx
│   │   │   ├── AuditCard.tsx
│   │   │   ├── AuditTable.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   ├── ViolationList.tsx
│   │   │   ├── ViolationCard.tsx
│   │   │   ├── ViolationAccordion.tsx
│   │   │   ├── CodeSnippet.tsx
│   │   │   ├── SeverityBadge.tsx
│   │   │   ├── WCAGLevelBadge.tsx
│   │   │   ├── ExportButton.tsx
│   │   │   └── EmptyState.tsx
│   │   │
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── MainLayout.tsx
│   │
│   ├── hooks/
│   │   ├── useReports.ts        # Load manifest + individual reports
│   │   ├── useFilters.ts        # Filter state + derived data
│   │   ├── useViolations.ts     # Group/sort violations
│   │   └── useKeyboard.ts       # Keyboard nav helpers
│   │
│   ├── context/
│   │   └── AuditContext.tsx     # React Context for selected audit
│   │
│   ├── types/
│   │   └── audit.ts             # AuditReport, Violation, etc.
│   │
│   ├── utils/
│   │   ├── date.ts              # pt-BR date formatting
│   │   ├── severity.ts          # Severity ordering, colors
│   │   ├── lbi.ts               # LBI article mapping
│   │   └── export.ts            # PDF/JSON export helpers
│   │
│   └── styles/
│       └── globals.css          # A11y overrides, focus styles
```

## 2. shadcn/ui Components Required

| Component | Registry Name | Purpose |
|-----------|---------------|---------|
| Button | `button` | Primary actions, export, filter clear |
| Table | `table` | Audit list (desktop) |
| Badge | `badge` | Severity chips, WCAG level tags |
| Dialog | `dialog` | Violation detail modal |
| Tabs | `tabs` | Group violations by severity/WCAG/rule |
| Select | `select` | Filter dropdowns (WCAG level, severity) |
| DatePicker | `date-picker` | Date range filter |
| Card | `card` | Audit card (mobile), violation card |
| ScrollArea | `scroll-area` | Long violation lists, code snippets |
| Separator | `separator` | Visual grouping in lists |
| Tooltip | `tooltip` | Help text on badges, truncated text |
| DropdownMenu | `dropdown-menu` | Row actions (view, export) |
| Accordion | `accordion` | Violation groups (mobile) |
| Skeleton | `skeleton` | Loading states |
| Alert | `alert` | Error states, empty results |
| Toast | `toast` | Export success, errors |
| Label | `label` | Form labels for filters |

> **Install**: `bunx shadcn@latest add button table badge dialog tabs select date-picker card scroll-area separator tooltip dropdown-menu accordion skeleton alert toast label`

## 3. Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        Build Time                               │
├─────────────────────────────────────────────────────────────────┤
│  CLI Scanner (src/audit.ts)                                     │
│       │                                                         │
│       ▼                                                         │
│  reports/*.json  ──────►  public/reports/  (via build script)   │
│       │                                                         │
│       ▼                                                         │
│  Manifest: public/reports/manifest.json                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Runtime                                  │
├─────────────────────────────────────────────────────────────────┤
│  useReports hook                                                │
│       │                                                         │
│       ├─► fetch("/reports/manifest.json")  ──► AuditMeta[]      │
│       │                                                         │
│       └─► fetch(`/reports/${filename}`)  ──► AuditReport (lazy) │
│              │                                                  │
│              ▼                                                  │
│  useFilters hook  ◄──►  FilterState (WCAG, date, severity)     │
│              │                                                  │
│              ▼                                                  │
│  useViolations hook  ──►  grouped/filtered/sorted violations   │
│              │                                                  │
│              ▼                                                  │
│  Components (AuditList, ViolationList, etc.)                    │
└─────────────────────────────────────────────────────────────────┘
```

### Data Loading Strategy

1. **Manifest first** — `fetch("/reports/manifest.json")` returns:
   ```json
   [
     { "filename": "2026-01-15-esus.json", "url": "https://esus.saude.gov.br", "timestamp": "2026-01-15T10:30:00Z", "summary": { "total": 42, "bySeverity": {...}, "byLevel": {...} } }
   ]
   ```

2. **Lazy detail** — Full report loaded on demand when auditor clicks audit row:
   ```typescript
   const loadReport = async (filename: string) => {
     const res = await fetch(`/reports/${filename}`);
     return res.json() as Promise<AuditReport>;
   };
   ```

3. **Client-side ops** — All filtering, grouping, sorting in memory (reports < 500 violations typical)

## 4. Component Hierarchy

```
App
└── MainLayout (providers: AuditContext, Toaster)
    ├── Header
    │   ├── Logo + Title
    │   └── GlobalActions (Export all, Settings)
    │
    ├── Sidebar (mobile: drawer)
    │   └── FilterBar
    │       ├── WCAGLevelSelect (A/AA/AAA multi-select)
    │       ├── SeveritySelect (critical/major/minor multi-select)
    │       ├── DateRangePicker (from/to)
    │       ├── SearchInput (URL filter)
    │       └── ClearFiltersButton
    │
    └── MainContent
        ├── AuditListView (default)
        │   ├── Desktop: AuditTable
        │   │   ├── TableHeader (sortable columns)
        │   │   └── TableRow → AuditCard (click → select)
        │   │
        │   └── Mobile: AuditCardList (stacked cards)
        │       └── AuditCard (tap → select)
        │
        └── AuditDetailView (when audit selected)
            ├── AuditHeader (URL, timestamp, summary chips)
            ├── ViolationTabs (Severity | WCAG Level | Rule ID)
            └── ViolationList
                ├── Desktop: Split view (list + side detail)
                │   ├── ViolationAccordion (groups)
                │   │   └── ViolationCard (expanded)
                │   │       ├── SeverityBadge + WCAGLevelBadge
                │   │       ├── RuleDescription + Help
                │   │       ├── CodeSnippet (with line highlight)
                │   │       └── LBIMapping (article + description)
                │   │
                │   └── ViolationDetailPanel (selected violation)
                │
                └── Mobile: Full-screen accordion stack
                    └── ViolationAccordion
                        └── ViolationCard (tap expand)
                            └── (same content)
```

## 5. Routing

**Single-page application with view state** — no router needed.

```typescript
type View = "list" | "detail";

interface AppState {
  view: View;
  selectedAuditId: string | null;
  filters: FilterState;
}
```

- Default: `view="list"`, `selectedAuditId=null`
- Click audit → `view="detail"`, `selectedAuditId=audit.id`
- Back/Escape → `view="list"`, `selectedAuditId=null`
- URL sync optional: `?audit=2026-01-15-esus.json` for deep linking

## 6. State Management

### React Context (minimal)

```typescript
// context/AuditContext.tsx
interface AuditContextValue {
  selectedAudit: AuditReport | null;
  setSelectedAudit: (audit: AuditReport | null) => void;
  view: "list" | "detail";
  setView: (view: "list" | "detail") => void;
}
```

### Hooks for derived state

| Hook | Responsibility |
|------|----------------|
| `useReports` | Load manifest, lazy-load selected report, cache |
| `useFilters` | Filter state (URL, localStorage sync), derived filter fn |
| `useViolations` | Group by severity/WCAG/rule, sort, memoized |

**No TanStack Query** — data is static JSON, no server mutations, caching not needed. `useReports` uses simple `useState` + `useEffect` with in-memory cache.

### LocalStorage Persistence

- Filter state persisted to `localStorage["acessi-filters"]`
- Restored on mount
- View state NOT persisted (always start at list)

## 7. Build & Output

### Vite Config

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  base: "./",                    // Relative paths for static hosting
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
    rollupOptions: {
      input: "index.html",
    },
  },
  publicDir: "public",           // Copies public/reports/ to dist/reports/
});
```

### Build Script (package.json)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "copy:reports": "cp -r ../reports public/reports && node scripts/generate-manifest.js"
  }
}
```

### Manifest Generation

```javascript
// scripts/generate-manifest.js
const fs = require("fs");
const path = require("path");

const reportsDir = path.join(__dirname, "../public/reports");
const files = fs.readdirSync(reportsDir).filter(f => f.endsWith(".json"));

const manifest = files.map(filename => {
  const content = JSON.parse(fs.readFileSync(path.join(reportsDir, filename), "utf-8"));
  return {
    filename,
    url: content.meta.url,
    timestamp: content.meta.timestamp,
    summary: content.summary,
  };
});

fs.writeFileSync(
  path.join(reportsDir, "manifest.json"),
  JSON.stringify(manifest, null, 2)
);
```

### Output Structure

```
dist/
├── index.html
├── assets/
│   ├── index-<hash>.js
│   ├── index-<hash>.css
│   └── ...
└── reports/
    ├── manifest.json
    ├── 2026-01-15-esus.json
    ├── 2026-01-16-conectesus.json
    └── ...
```

### Deployment Targets

- **Static hosting**: Netlify, Vercel, GitHub Pages, S3+CloudFront
- **Docker**: `nginx:alpine` serving `dist/`
- **Internal**: Copy `dist/` to internal web server

## 8. Accessibility Implementation Notes

| Requirement | Implementation |
|-------------|----------------|
| WCAG 2.1 AA self-compliance | shadcn/ui primitives + custom focus styles, semantic HTML |
| pt-BR primary | All strings in Portuguese, `lang="pt-BR"` on `<html>` |
| Mobile responsive | Breakpoints per design spec, mobile-first CSS |
| Keyboard navigation | Tab order, arrow keys in accordions, Esc closes dialogs |
| Screen readers | Landmarks, heading hierarchy, `aria-live` for filter results |
| High contrast | CSS custom properties, `forced-colors` media query |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` disables transitions |
| Zoom 200% | Fluid layout, no horizontal scroll, relative units |

## 9. LBI Mapping Integration

```typescript
// utils/lbi.ts
interface LBIArticle {
  article: string;      // e.g., "Art. 63"
  title: string;        // "Acessibilidade em sítios da internet"
  description: string;
  wcagCriteria: string[];  // ["1.4.3", "2.1.1"]
}

const LBI_MAPPING: Record<string, LBIArticle[]> = {
  "color-contrast": [{ article: "Art. 63", title: "...", description: "...", wcagCriteria: ["1.4.3"] }],
  "label": [{ article: "Art. 63", title: "...", description: "...", wcagCriteria: ["1.3.1", "4.1.2"] }],
  // ...
};

export function getLBIMapping(ruleId: string): LBIArticle[] {
  return LBI_MAPPING[ruleId] || [];
}
```

## 10. Export Implementation

```typescript
// utils/export.ts
export async function exportToJSON(audit: AuditReport): Promise<Blob> {
  return new Blob([JSON.stringify(audit, null, 2)], { type: "application/json" });
}

export async function exportToPDF(audit: AuditReport): Promise<Blob> {
  // Use @react-pdf/renderer or jsPDF
  // Layout: Cover → Summary → Violations (grouped) → LBI Appendix
}
```

---

**Next Steps**: 
1. Scaffold Vite + React + Tailwind in `frontend/`
2. Install shadcn/ui components (list above)
3. Implement `useReports` + `AuditList` + `FilterBar` with test data
4. Wire manifest loader and detail view