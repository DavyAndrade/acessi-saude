import { useMemo } from 'react';
import type { Violation, Severity, WCAGLevel, GroupedViolations } from '@/types/audit';
import { sortBySeverity } from '@/utils/severity';

export function useViolations(violations: Violation[]) {
  const grouped = useMemo((): GroupedViolations => {
    const bySeverity: GroupedViolations['bySeverity'] = {
      critical: [],
      serious: [],
      moderate: [],
      minor: [],
    };
    const byLevel: GroupedViolations['byLevel'] = {
      A: [],
      AA: [],
      AAA: [],
    };
    const byRule: GroupedViolations['byRule'] = {};

    for (const v of violations) {
      bySeverity[v.severity].push(v);
      byLevel[v.wcagLevel].push(v);
      if (!byRule[v.ruleId]) byRule[v.ruleId] = [];
      byRule[v.ruleId].push(v);
    }

    for (const key of Object.keys(bySeverity) as Severity[]) {
      bySeverity[key] = sortBySeverity(bySeverity[key]);
    }
    for (const key of Object.keys(byLevel) as WCAGLevel[]) {
      byLevel[key] = sortBySeverity(byLevel[key]);
    }
    for (const key of Object.keys(byRule)) {
      byRule[key] = sortBySeverity(byRule[key]);
    }

    return { bySeverity, byLevel, byRule };
  }, [violations]);

  const sortedViolations = useMemo(() => sortBySeverity(violations), [violations]);

  const getViolationsByTab = useMemo(() => {
    return {
      severity: grouped.bySeverity,
      level: grouped.byLevel,
      rule: grouped.byRule,
    };
  }, [grouped]);

  return {
    violations: sortedViolations,
    grouped,
    getViolationsByTab,
  };
}