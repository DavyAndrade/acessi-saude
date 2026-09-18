import { useState, useEffect, useCallback } from 'react';
import type { AuditMeta, AuditReport } from '@/types/audit';

const MANIFEST_URL = '/reports/manifest.json';

export function useReports() {
  const [manifest, setManifest] = useState<AuditMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportsCache, setReportsCache] = useState<Map<string, AuditReport>>(new Map());

  useEffect(() => {
    async function loadManifest() {
      try {
        setLoading(true);
        const response = await fetch(MANIFEST_URL);
        if (!response.ok) {
          throw new Error(`Falha ao carregar manifesto: ${response.status}`);
        }
        const data = await response.json();
        setManifest(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }
    loadManifest();
  }, []);

  const loadReport = useCallback(async (filename: string): Promise<AuditReport | null> => {
    if (reportsCache.has(filename)) {
      return reportsCache.get(filename)!;
    }

    try {
      const response = await fetch(`/reports/${filename}`);
      if (!response.ok) {
        throw new Error(`Falha ao carregar relatório: ${response.status}`);
      }
      const data = await response.json();
      setReportsCache((prev) => {
        const next = new Map(prev);
        next.set(filename, data);
        return next;
      });
      return data;
    } catch (err) {
      console.error(`Erro ao carregar ${filename}:`, err);
      return null;
    }
  }, [reportsCache]);

  const getReport = useCallback(
    (filename: string): AuditReport | undefined => {
      return reportsCache.get(filename);
    },
    [reportsCache]
  );

  return {
    manifest,
    loading,
    error,
    loadReport,
    getReport,
  };
}