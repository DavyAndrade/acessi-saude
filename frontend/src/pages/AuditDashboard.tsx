import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AuditMeta } from '@/types/audit';
import { formatDateBR } from '@/utils/date';
import { SEVERITY_COLORS } from '@/utils/severity';
import { AuditTable } from '@/components/audit/AuditTable';
import { AuditCard } from '@/components/audit/AuditCard';
import { ViolationList } from '@/components/audit/ViolationList';
import { ExportButton } from '@/components/audit/ExportButton';
import { useReports } from '@/hooks/useReports';
import { useViolations } from '@/hooks/useViolations';
import { useAuditContext } from '@/context/AuditContext';
import { useFilters } from '@/context/FilterContext';

export function AuditDashboard() {
  const { manifest, loading, error, loadReport } = useReports();
  const { selectAudit, selectedAudit, selectedReport, clearSelection, loadingDetail } = useAuditContext();
  const { filteredManifest } = useFilters();
  const [activeTab, setActiveTab] = useState<'severity' | 'level' | 'rule'>('severity');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const violations = selectedReport?.violations || [];
  const grouped = useViolations(violations);

  const handleSelectAudit = async (audit: AuditMeta) => {
    await selectAudit(audit);
  };

  const handleExport = (audit: AuditMeta) => {
    loadReport(audit.filename).then((report) => {
      if (report) {
        console.log('Export', report);
      }
    });
  };

  const handleOpenUrl = (audit: AuditMeta) => {
    window.open(audit.url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="space-y-4" role="status" aria-label="Carregando auditorias">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-40">
              <CardContent className="h-full">
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-3 w-1/2 mb-2" />
                <Skeleton className="h-3 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Erro ao carregar auditorias: {error}
          <Button variant="outline" size="sm" className="ml-4" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
            Tentar novamente
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (filteredManifest.length === 0 && manifest.length > 0) {
    return (
      <Alert>
        <AlertDescription className="text-center py-8">
          Nenhuma auditoria corresponde aos filtros atuais.
        </AlertDescription>
      </Alert>
    );
  }

  if (manifest.length === 0) {
    return (
      <Alert>
        <AlertDescription className="text-center py-8">
          Nenhuma auditoria disponível. Execute o scanner CLI para gerar relatórios.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Auditorias de Acessibilidade</h1>
          <p className="text-muted-foreground">
            {filteredManifest.length} auditoria{filteredManifest.length !== 1 ? 's' : ''}
            {filteredManifest.length !== manifest.length && (
              <span className="ml-2 text-sm text-muted-foreground">
                (de {manifest.length} total)
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode('table')} className={cn(viewMode === 'table' && 'bg-primary text-primary-foreground')}>
            Tabela
          </Button>
          <Button variant="outline" size="sm" onClick={() => setViewMode('cards')} className={cn(viewMode === 'cards' && 'bg-primary text-primary-foreground')}>
            Cards
          </Button>
          <ExportButton />
        </div>
      </div>

      {!selectedAudit ? (
        <>
          {viewMode === 'table' ? (
            <AuditTable
              audits={filteredManifest}
              onSelect={handleSelectAudit}
              onViewDetails={handleSelectAudit}
              onExport={handleExport}
              onOpenUrl={handleOpenUrl}
              selectedId={null}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredManifest.map((audit) => (
                <AuditCard
                  key={audit.filename}
                  audit={audit}
                  onSelect={() => handleSelectAudit(audit)}
                  onViewDetails={() => handleSelectAudit(audit)}
                  onExport={() => handleExport(audit)}
                  onOpenUrl={() => handleOpenUrl(audit)}
                  isSelected={false}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-6 animate-in fade-in-0 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={clearSelection} aria-label="Voltar para lista">
                <ExternalLink className="h-5 w-5" aria-hidden="true" />
              </Button>
              <div>
                <p className="text-sm text-muted-foreground truncate max-w-[400px]">{selectedAudit.url}</p>
                <p className="text-xs text-muted-foreground">{formatDateBR(selectedAudit.timestamp)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ExportButton />
              <Badge variant="secondary" className="text-xs">
                Total: {selectedReport?.summary.total || 0}
              </Badge>
              {selectedReport && (
                <>
                  {selectedReport.summary.bySeverity.critical > 0 && (
                    <Badge className={SEVERITY_COLORS.critical} variant="outline">
                      {selectedReport.summary.bySeverity.critical} Crítico
                    </Badge>
                  )}
                  {selectedReport.summary.bySeverity.serious > 0 && (
                    <Badge className={SEVERITY_COLORS.serious} variant="outline">
                      {selectedReport.summary.bySeverity.serious} Sério
                    </Badge>
                  )}
                  {selectedReport.summary.bySeverity.moderate > 0 && (
                    <Badge className={SEVERITY_COLORS.moderate} variant="outline">
                      {selectedReport.summary.bySeverity.moderate} Moderado
                    </Badge>
                  )}
                  {selectedReport.summary.bySeverity.minor > 0 && (
                    <Badge className={SEVERITY_COLORS.minor} variant="outline">
                      {selectedReport.summary.bySeverity.minor} Menor
                    </Badge>
                  )}
                </>
              )}
            </div>
          </div>

          {loadingDetail ? (
            <div className="space-y-4" role="status" aria-label="Carregando detalhes">
              {[...Array(5)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="py-4">
                    <Skeleton className="h-8 w-1/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <ViolationList
              violations={violations}
              grouped={grouped.grouped}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          )}
        </div>
      )}
    </div>
  );
}