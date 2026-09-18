import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ExternalLink, Eye, Download, ChevronRight, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AuditMeta } from '@/types/audit';
import { formatDateBR } from '@/utils/date';
import { SEVERITY_COLORS } from '@/utils/severity';

interface AuditTableProps {
  audits: AuditMeta[];
  onSelect: (audit: AuditMeta) => void;
  onViewDetails: (audit: AuditMeta) => void;
  onExport: (audit: AuditMeta) => void;
  onOpenUrl: (audit: AuditMeta) => void;
  selectedId?: string | null;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
}

const COLUMNS = [
  { key: 'url', label: 'URL', sortable: true },
  { key: 'date', label: 'Data', sortable: true },
  { key: 'critical', label: 'Crítico', sortable: true },
  { key: 'serious', label: 'Sério', sortable: true },
  { key: 'moderate', label: 'Moderado', sortable: true },
  { key: 'minor', label: 'Menor', sortable: true },
  { key: 'actions', label: 'Ações', sortable: false },
] as const;

export function AuditTable({
  audits,
  onSelect,
  onViewDetails,
  onExport,
  onOpenUrl,
  selectedId,
  sortColumn,
  onSort,
}: AuditTableProps) {
  const handleRowClick = (audit: AuditMeta) => {
    onSelect(audit);
  };

  const handleKeyDown = (e: React.KeyboardEvent, audit: AuditMeta) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(audit);
    }
  };

  const renderSeverityBadge = (count: number, severity: 'critical' | 'serious' | 'moderate' | 'minor') => {
    if (count === 0) return <span className="text-muted-foreground text-center">—</span>;
    return (
      <Badge className={cn(SEVERITY_COLORS[severity], 'font-medium')} variant="outline">
        {count}
      </Badge>
    );
  };

  const renderSortableHeader = (column: { key: string; label: string; sortable: boolean }) => (
    <TableCell
      className={cn('cursor-pointer select-none', column.sortable && 'hover:bg-muted')}
      onClick={() => column.sortable && onSort?.(column.key)}
    >
      <div className="flex items-center gap-1">
        <span>{column.label}</span>
        {column.sortable && sortColumn === column.key && (
          <ArrowUpDown className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
        )}
      </div>
    </TableCell>
  );

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {COLUMNS.map((col) => renderSortableHeader(col))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {audits.length === 0 ? (
            <TableRow>
              <TableCell colSpan={COLUMNS.length} className="text-center py-8 text-muted-foreground">
                Nenhuma auditoria encontrada
              </TableCell>
            </TableRow>
          ) : (
            audits.map((audit) => (
              <TableRow
                key={audit.filename}
                className={cn(
                  'cursor-pointer transition-colors',
                  'hover:bg-muted/50',
                  selectedId === audit.filename && 'bg-primary/5'
                )}
                onClick={() => handleRowClick(audit)}
                onKeyDown={(e) => handleKeyDown(e, audit)}
                tabIndex={0}
                role="button"
                aria-pressed={selectedId === audit.filename}
              >
                <TableCell className="font-medium max-w-[300px] truncate">
                  <a
                    href={audit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {audit.url}
                  </a>
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                  {formatDateBR(audit.timestamp)}
                </TableCell>
                <TableCell className="text-center">
                  {renderSeverityBadge(audit.summary.bySeverity.critical, 'critical')}
                </TableCell>
                <TableCell className="text-center">
                  {renderSeverityBadge(audit.summary.bySeverity.serious, 'serious')}
                </TableCell>
                <TableCell className="text-center">
                  {renderSeverityBadge(audit.summary.bySeverity.moderate, 'moderate')}
                </TableCell>
                <TableCell className="text-center">
                  {renderSeverityBadge(audit.summary.bySeverity.minor, 'minor')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only">Ações para {audit.url}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onViewDetails(audit); }}>
                        <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
                        Ver detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onExport(audit); }}>
                        <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                        Exportar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onOpenUrl(audit); }}>
                        <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" />
                        Abrir URL
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}