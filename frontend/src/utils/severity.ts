import type { Severity, WCAGLevel } from '@/types/audit';

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

export const SEVERITY_ICON_COLORS: Record<Severity, string> = {
  critical: 'text-red-600 dark:text-red-400',
  serious: 'text-orange-600 dark:text-orange-400',
  moderate: 'text-yellow-600 dark:text-yellow-400',
  minor: 'text-blue-600 dark:text-blue-400',
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

export function sortBySeverity<T extends { severity: Severity }>(
  items: T[],
  ascending = true
): T[] {
  return [...items].sort((a, b) => {
    const diff = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
    return ascending ? diff : -diff;
  });
}

export function getHighestSeverity(violations: { severity: Severity }[]): Severity | null {
  if (violations.length === 0) return null;
  return violations.reduce((highest, current) =>
    SEVERITY_ORDER[current.severity] < SEVERITY_ORDER[highest.severity] ? current : highest
  ).severity;
}

export function countBySeverity(
  violations: { severity: Severity }[]
): Record<Severity, number> {
  const counts: Record<Severity, number> = {
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0,
  };
  for (const v of violations) {
    counts[v.severity]++;
  }
  return counts;
}

export function countByLevel(
  violations: { wcagLevel: WCAGLevel }[]
): Record<WCAGLevel, number> {
  const counts: Record<WCAGLevel, number> = {
    A: 0,
    AA: 0,
    AAA: 0,
  };
  for (const v of violations) {
    counts[v.wcagLevel]++;
  }
  return counts;
}