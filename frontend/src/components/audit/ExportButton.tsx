import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { useAuditContext } from '@/context/AuditContext';
import { downloadJSON, downloadPDF, downloadCSV } from '@/utils/export';
import { useToast } from '@/hooks/useToast';

export function ExportButton() {
  const { selectedReport } = useAuditContext();
  const { toast } = useToast();

  const handleExport = async (format: 'json' | 'pdf' | 'csv') => {
    if (!selectedReport) return;

    try {
      const filename = `auditoria-${selectedReport.url.replace(/https?:\/\//, '').replace(/[^a-z0-9]/gi, '-')}-${new Date().toISOString().split('T')[0]}`;

      switch (format) {
        case 'json':
          downloadJSON(selectedReport, `${filename}.json`);
          break;
        case 'pdf':
          await downloadPDF(selectedReport, `${filename}.pdf`);
          break;
        case 'csv':
          downloadCSV(selectedReport, `${filename}.csv`);
          break;
      }

      toast({
        title: 'Exportação concluída',
        description: `Relatório exportado como ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Erro na exportação:', error);
      toast({
        title: 'Erro na exportação',
        description: 'Não foi possível exportar o relatório',
        variant: 'destructive',
      });
    }
  };

  if (!selectedReport) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" aria-hidden="true" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('json')}>
          <FileText className="h-4 w-4 mr-2" aria-hidden="true" />
          JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileSpreadsheet className="h-4 w-4 mr-2" aria-hidden="true" />
          CSV
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FileText className="h-4 w-4 mr-2" aria-hidden="true" />
          PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}