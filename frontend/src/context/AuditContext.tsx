import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { AuditReport, AuditMeta } from '@/types/audit';
import { useToast } from '@/hooks/useToast';

interface AuditContextType {
  selectedAudit: AuditMeta | null;
  selectedReport: AuditReport | null;
  selectAudit: (audit: AuditMeta) => Promise<void>;
  clearSelection: () => void;
  loadingDetail: boolean;
  error: string | null;
}

const AuditContext = createContext<AuditContextType | null>(null);

export function AuditProvider({ children }: { children: ReactNode }) {
  const [selectedAudit, setSelectedAudit] = useState<AuditMeta | null>(null);
  const [selectedReport, setSelectedReport] = useState<AuditReport | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const selectAudit = useCallback(async (audit: AuditMeta) => {
    setSelectedAudit(audit);
    setLoadingDetail(true);
    setError(null);
    try {
      const response = await fetch(`/reports/${audit.filename}`);
      if (response.ok) {
        const report = await response.json();
        setSelectedReport(report);
      } else {
        const errMsg = `Erro ${response.status}: ${response.statusText}`;
        setError(errMsg);
        toast({
          title: 'Erro ao carregar relatório',
          description: errMsg,
          variant: 'destructive',
        });
        setSelectedReport(null);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errMsg);
      toast({
        title: 'Erro ao carregar relatório',
        description: errMsg,
        variant: 'destructive',
      });
      setSelectedReport(null);
    } finally {
      setLoadingDetail(false);
    }
  }, [toast]);

  const clearSelection = useCallback(() => {
    setSelectedAudit(null);
    setSelectedReport(null);
    setError(null);
  }, []);

  return (
    <AuditContext.Provider
      value={{
        selectedAudit,
        selectedReport,
        selectAudit,
        clearSelection,
        loadingDetail,
        error,
      }}
    >
      {children}
    </AuditContext.Provider>
  );
}

export function useAuditContext() {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error('useAuditContext deve ser usado dentro de AuditProvider');
  }
  return context;
}