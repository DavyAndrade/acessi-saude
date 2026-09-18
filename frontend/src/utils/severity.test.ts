import { describe, it, expect } from 'vitest';
import {
  SEVERITY_ORDER,
  SEVERITY_LABELS,
  WCAG_LEVEL_LABELS,
  sortBySeverity,
  getHighestSeverity,
  countBySeverity,
  countByLevel,
} from './severity';
import type { Severity, WCAGLevel } from '@/types/audit';

describe('severity utils', () => {
  describe('SEVERITY_ORDER', () => {
    it('should have correct order', () => {
      expect(SEVERITY_ORDER.critical).toBe(0);
      expect(SEVERITY_ORDER.serious).toBe(1);
      expect(SEVERITY_ORDER.moderate).toBe(2);
      expect(SEVERITY_ORDER.minor).toBe(3);
    });
  });

  describe('SEVERITY_LABELS', () => {
    it('should have Portuguese labels', () => {
      expect(SEVERITY_LABELS.critical).toBe('Crítico');
      expect(SEVERITY_LABELS.serious).toBe('Sério');
      expect(SEVERITY_LABELS.moderate).toBe('Moderado');
      expect(SEVERITY_LABELS.minor).toBe('Menor');
    });
  });

  describe('sortBySeverity', () => {
    it('should sort violations by severity ascending', () => {
      const violations = [
        { severity: 'minor' as Severity, ruleId: 'a' },
        { severity: 'critical' as Severity, ruleId: 'b' },
        { severity: 'moderate' as Severity, ruleId: 'c' },
        { severity: 'serious' as Severity, ruleId: 'd' },
      ];

      const sorted = sortBySeverity(violations);

      expect(sorted[0].severity).toBe('critical');
      expect(sorted[1].severity).toBe('serious');
      expect(sorted[2].severity).toBe('moderate');
      expect(sorted[3].severity).toBe('minor');
    });

    it('should sort descending when ascending is false', () => {
      const violations = [
        { severity: 'minor' as Severity, ruleId: 'a' },
        { severity: 'critical' as Severity, ruleId: 'b' },
      ];

      const sorted = sortBySeverity(violations, false);

      expect(sorted[0].severity).toBe('minor');
      expect(sorted[1].severity).toBe('critical');
    });
  });

  describe('getHighestSeverity', () => {
    it('should return highest severity', () => {
      const violations = [
        { severity: 'minor' as Severity },
        { severity: 'critical' as Severity },
        { severity: 'moderate' as Severity },
      ];

      expect(getHighestSeverity(violations)).toBe('critical');
    });

    it('should return null for empty array', () => {
      expect(getHighestSeverity([])).toBeNull();
    });
  });

  describe('countBySeverity', () => {
    it('should count violations by severity', () => {
      const violations = [
        { severity: 'critical' as Severity },
        { severity: 'critical' as Severity },
        { severity: 'serious' as Severity },
        { severity: 'moderate' as Severity },
      ];

      const counts = countBySeverity(violations);

      expect(counts.critical).toBe(2);
      expect(counts.serious).toBe(1);
      expect(counts.moderate).toBe(1);
      expect(counts.minor).toBe(0);
    });
  });

  describe('countByLevel', () => {
    it('should count violations by WCAG level', () => {
      const violations = [
        { wcagLevel: 'A' as WCAGLevel },
        { wcagLevel: 'A' as WCAGLevel },
        { wcagLevel: 'AA' as WCAGLevel },
      ];

      const counts = countByLevel(violations);

      expect(counts.A).toBe(2);
      expect(counts.AA).toBe(1);
      expect(counts.AAA).toBe(0);
    });
  });

  describe('WCAG_LEVEL_LABELS', () => {
    it('should have Portuguese labels', () => {
      expect(WCAG_LEVEL_LABELS.A).toBe('Nível A');
      expect(WCAG_LEVEL_LABELS.AA).toBe('Nível AA');
      expect(WCAG_LEVEL_LABELS.AAA).toBe('Nível AAA');
    });
  });
});