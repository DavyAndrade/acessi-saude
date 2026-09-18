export type WCAGLevel = 'A' | 'AA' | 'AAA';
export type Severity = 'critical' | 'serious' | 'moderate' | 'minor';
export type LBIArticle = string;

export interface ViolationNode {
  html: string;
  target: string[];
  xpath?: string;
}

export interface Violation {
  id: string;
  ruleId: string;
  ruleDescription: string;
  help: string;
  helpUrl: string;
  severity: Severity;
  wcagLevel: WCAGLevel;
  wcagTags: string[];
  lbiArticle?: LBIArticle;
  nodes: ViolationNode[];
  impact: Severity;
  tags: string[];
}

export interface SeveritySummary {
  critical: number;
  serious: number;
  moderate: number;
  minor: number;
}

export interface LevelSummary {
  A: number;
  AA: number;
  AAA: number;
}

export interface AuditSummary {
  total: number;
  bySeverity: SeveritySummary;
  byLevel: LevelSummary;
}

export interface AuditMeta {
  filename: string;
  url: string;
  timestamp: string;
  summary: AuditSummary;
}

export interface AuditReport {
  url: string;
  timestamp: string;
  userAgent: string;
  viewport: { width: number; height: number };
  violations: Violation[];
  passes: Violation[];
  incomplete: Violation[];
  inapplicable: Violation[];
  summary: AuditSummary;
}

export interface FilterState {
  wcagLevels: WCAGLevel[];
  severities: Severity[];
  dateRange: { from: string | null; to: string | null };
  search: string;
}

export interface GroupedViolations {
  bySeverity: Record<Severity, Violation[]>;
  byLevel: Record<WCAGLevel, Violation[]>;
  byRule: Record<string, Violation[]>;
}

export const SEVERITY_ORDER: Record<Severity, number> = {
  critical: 0,
  serious: 1,
  moderate: 2,
  minor: 3,
};

export const SEVERITY_LABELS: Record<Severity, string> = {
  critical: 'Crítico',
  serious: 'Sério',
  moderate: 'Moderado',
  minor: 'Menor',
};

export const SEVERITY_COLORS: Record<Severity, string> = {
  critical: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300',
  serious: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300',
  moderate: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300',
  minor: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300',
};

export const WCAG_LEVEL_LABELS: Record<WCAGLevel, string> = {
  A: 'Nível A',
  AA: 'Nível AA',
  AAA: 'Nível AAA',
};

export const WCAG_LEVEL_COLORS: Record<WCAGLevel, string> = {
  A: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300',
  AA: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300',
  AAA: 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300',
};