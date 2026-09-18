import { Button } from '@/components/ui/button';
import { Download, Settings, Menu } from 'lucide-react';
import { useAuditContext } from '@/context/AuditContext';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { selectedReport, selectedAudit } = useAuditContext();

  const handleExportAll = () => {
    console.log('Export all reports');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Abrir menu de filtros"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>

        <div className="flex items-center gap-3">
          <svg
            className="h-8 w-8 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          <div>
            <h1 className="text-lg font-semibold text-foreground">AcessiSaúde</h1>
            <p className="text-xs text-muted-foreground">Dashboard de Auditoria WCAG 2.1</p>
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          {selectedReport && (
            <Button variant="outline" size="sm" onClick={handleExportAll} disabled={!selectedReport}>
              <Download className="h-4 w-4 mr-2" aria-hidden="true" />
              Exportar Relatório
            </Button>
          )}

          <Button variant="ghost" size="icon" aria-label="Configurações">
            <Settings className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {selectedAudit && (
        <div className="border-t px-4 py-2 bg-muted/30">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium text-foreground">Auditoria selecionada:</span>
            <span className="text-muted-foreground truncate max-w-xs">{selectedAudit.url}</span>
            <span className="text-muted-foreground">{new Date(selectedAudit.timestamp).toLocaleString('pt-BR')}</span>
          </div>
        </div>
      )}
    </header>
  );
}