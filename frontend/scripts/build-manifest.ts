#!/usr/bin/env bun

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..', '..');
const REPORTS_DIR = join(PROJECT_ROOT, 'reports');
const PUBLIC_REPORTS_DIR = join(__dirname, '..', 'public', 'reports');
const MANIFEST_PATH = join(PUBLIC_REPORTS_DIR, 'manifest.json');

interface AuditMeta {
  filename: string;
  url: string;
  timestamp: string;
  summary: {
    total: number;
    bySeverity: Record<string, number>;
    byLevel: Record<string, number>;
  };
}

function main() {
  console.log('🔍 Gerando manifesto de relatórios...');

  if (!existsSync(REPORTS_DIR)) {
    console.log('📁 Diretório de relatórios não encontrado:', REPORTS_DIR);
    console.log('📝 Criando diretório e manifesto vazio...');
    mkdirSync(PUBLIC_REPORTS_DIR, { recursive: true });
    writeFileSync(MANIFEST_PATH, JSON.stringify([], null, 2));
    return;
  }

  const files = readdirSync(REPORTS_DIR).filter((f) => f.endsWith('.json'));

  if (files.length === 0) {
    console.log('📝 Nenhum relatório encontrado. Criando manifesto vazio...');
    mkdirSync(PUBLIC_REPORTS_DIR, { recursive: true });
    writeFileSync(MANIFEST_PATH, JSON.stringify([], null, 2));
    return;
  }

  const manifest: AuditMeta[] = [];

  for (const file of files) {
    try {
      const filePath = join(REPORTS_DIR, file);
      const content = readFileSync(filePath, 'utf-8');
      const report = JSON.parse(content);

      const meta: AuditMeta = {
        filename: file,
        url: report.url || 'unknown',
        timestamp: report.timestamp || new Date().toISOString(),
        summary: {
          total: report.summary?.total || report.violations?.length || 0,
          bySeverity: report.summary?.bySeverity || {
            critical: 0,
            serious: 0,
            moderate: 0,
            minor: 0,
          },
          byLevel: report.summary?.byLevel || {
            A: 0,
            AA: 0,
            AAA: 0,
          },
        },
      };

      manifest.push(meta);

      // Copy report to public/reports for serving
      const destPath = join(PUBLIC_REPORTS_DIR, file);
      writeFileSync(destPath, content);
    } catch (error) {
      console.error(`❌ Erro ao processar ${file}:`, error);
    }
  }

  // Sort by timestamp descending (newest first)
  manifest.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  mkdirSync(PUBLIC_REPORTS_DIR, { recursive: true });
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.log(`✅ Manifesto gerado com ${manifest.length} relatório(s)`);
  console.log(`📄 Salvo em: ${MANIFEST_PATH}`);
}

main();