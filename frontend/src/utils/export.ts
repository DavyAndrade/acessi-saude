import type { AuditReport, AuditMeta } from '@/types/audit';
import { formatDateBR } from './date';
import { SEVERITY_LABELS, WCAG_LEVEL_LABELS } from './severity';
import { getLBIArticle } from './lbi';

export function downloadJSON(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateReportJSON(report: AuditReport): string {
  return JSON.stringify(report, null, 2);
}

export function generateManifestJSON(manifest: AuditMeta[]): string {
  return JSON.stringify(manifest, null, 2);
}

export async function downloadPDF(report: AuditReport, filename: string): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();

  const margin = 14;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Relatório de Auditoria de Acessibilidade', margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`URL: ${report.url}`, margin, y);
  y += 5;
  doc.text(`Data: ${formatDateBR(report.timestamp)}`, margin, y);
  y += 5;
  doc.text(`Total de violações: ${report.summary.total}`, margin, y);
  y += 5;
  doc.text(`Críticas: ${report.summary.bySeverity.critical} | Sérias: ${report.summary.bySeverity.serious} | Moderadas: ${report.summary.bySeverity.moderate} | Menores: ${report.summary.bySeverity.minor}`, margin, y);
  y += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Violações', margin, y);
  y += 7;

  for (const violation of report.violations) {
    if (y > 270) {
      doc.addPage();
      y = margin;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${violation.ruleId} (${SEVERITY_LABELS[violation.severity]})`, margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const descLines = doc.splitTextToSize(violation.ruleDescription, contentWidth);
    doc.text(descLines, margin, y);
    y += descLines.length * 4.5;

    const lbi = getLBIArticle(violation.ruleId);
    if (lbi) {
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      const lbiLines = doc.splitTextToSize(`LBI: ${lbi}`, contentWidth);
      doc.text(lbiLines, margin, y);
      y += lbiLines.length * 4.5;
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const snippet = violation.nodes[0]?.html.slice(0, 200) || 'N/A';
    const snippetLines = doc.splitTextToSize(`Código: ${snippet}`, contentWidth);
    doc.text(snippetLines, margin, y);
    y += snippetLines.length * 4 + 4;
  }

  doc.save(filename);
}

export function generateCSV(report: AuditReport): string {
  const headers = [
    'Rule ID',
    'Severity',
    'WCAG Level',
    'Description',
    'Help URL',
    'LBI Article',
    'HTML Snippet',
    'Target',
  ];

  const rows = report.violations.map((v: import('@/types/audit').Violation) => [
    v.ruleId,
    SEVERITY_LABELS[v.severity],
    WCAG_LEVEL_LABELS[v.wcagLevel],
    v.ruleDescription.replace(/"/g, '""'),
    v.helpUrl,
    getLBIArticle(v.ruleId) || '',
    v.nodes[0]?.html.slice(0, 500).replace(/"/g, '""') || '',
    v.nodes[0]?.target.join(', ') || '',
  ]);

  return [headers.join(','), ...rows.map((r: string[]) => r.map((c: string) => `"${c}"`).join(','))].join('\n');
}

export function downloadCSV(report: AuditReport, filename: string): void {
  const csv = generateCSV(report);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}