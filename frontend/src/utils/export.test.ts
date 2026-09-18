import type { MockInstance } from 'vitest';
/// <reference types="jsdom" />
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { vi } from 'vitest';
import { downloadJSON, generateReportJSON, generateManifestJSON, generateCSV } from './export';
import type { AuditReport, AuditMeta, Violation } from '@/types/audit';

describe('export utils', () => {
  const mockViolation: Violation = {
    id: 'test-1',
    ruleId: 'color-contrast',
    ruleDescription: 'Elementos devem ter contraste suficiente',
    help: 'Texto deve ter contraste 4.5:1',
    helpUrl: 'https://example.com/help',
    severity: 'serious',
    wcagLevel: 'AA',
    wcagTags: ['wcag2aa'],
    nodes: [{ html: '<button>Test</button>', target: ['button'] }],
    impact: 'serious',
    tags: ['wcag2aa'],
  };

  const mockReport: AuditReport = {
    url: 'https://example.com',
    timestamp: '2026-01-15T10:30:00Z',
    userAgent: 'test-agent',
    viewport: { width: 1280, height: 720 },
    violations: [mockViolation],
    passes: [],
    incomplete: [],
    inapplicable: [],
    summary: {
      total: 1,
      bySeverity: { critical: 0, serious: 1, moderate: 0, minor: 0 },
      byLevel: { A: 0, AA: 1, AAA: 0 },
    },
  };

  const mockManifest: AuditMeta[] = [
    {
      filename: '2026-01-15-example.json',
      url: 'https://example.com',
      timestamp: '2026-01-15T10:30:00Z',
      summary: mockReport.summary,
    },
  ];

  let createElementSpy: MockInstance<typeof document.createElement>;
  let appendChildSpy: MockInstance<typeof document.body.appendChild>;
  let removeChildSpy: MockInstance<typeof document.body.removeChild>;
  let clickSpy: ReturnType<typeof vi.fn>;
  let revokeObjectURLSpy: MockInstance<typeof URL.revokeObjectURL>;
  let createObjectURLSpy: MockInstance<typeof URL.createObjectURL>;

  beforeEach(() => {
    clickSpy = vi.fn();
    const mockLink = {
      href: '',
      download: '',
      click: clickSpy,
    };

    createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as unknown as HTMLAnchorElement);
    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockReturnValue(mockLink as unknown as Node);
    removeChildSpy = vi.spyOn(document.body, 'removeChild').mockReturnValue(mockLink as unknown as Node);
    createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('mock-url');
    revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  });

  afterEach(() => {
    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
  });

  describe('downloadJSON', () => {
    it('should create download link and trigger click', () => {
      downloadJSON({ test: 'data' }, 'test.json');

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(appendChildSpy).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('mock-url');
    });
  });

  describe('generateReportJSON', () => {
    it('should generate formatted JSON', () => {
      const json = generateReportJSON(mockReport);
      const parsed = JSON.parse(json);

      expect(parsed.url).toBe('https://example.com');
      expect(parsed.violations).toHaveLength(1);
      expect(parsed.violations[0].ruleId).toBe('color-contrast');
    });
  });

  describe('generateManifestJSON', () => {
    it('should generate formatted manifest JSON', () => {
      const json = generateManifestJSON(mockManifest);
      const parsed = JSON.parse(json);

      expect(parsed).toHaveLength(1);
      expect(parsed[0].filename).toBe('2026-01-15-example.json');
    });
  });

  describe('generateCSV', () => {
    it('should generate CSV with headers and data', () => {
      const csv = generateCSV(mockReport);
      const lines = csv.split('\n');

      expect(lines[0]).toContain('Rule ID');
      expect(lines[0]).toContain('Severity');
      expect(lines[0]).toContain('WCAG Level');
      expect(lines[1]).toContain('color-contrast');
      expect(lines[1]).toContain('Sério');
      expect(lines[1]).toContain('Nível AA');
    });
  });
});