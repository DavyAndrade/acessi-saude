import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ExternalLink, Eye, Download, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AuditMeta } from '@/types/audit';
import { formatDateBR } from '@/utils/date';
import { SEVERITY_COLORS, WCAG_LEVEL_COLORS } from '@/utils/severity';

interface AuditCardProps {
  audit: AuditMeta;
  onSelect: () => void;
  onViewDetails: () => void;
  onExport: () => void;
  onOpenUrl: () => void;
  isSelected?: boolean;
}

export function AuditCard({
  audit,
  onSelect,
  onViewDetails,
  onExport,
  onOpenUrl,
  isSelected = false,
}: AuditCardProps) {
  const total = audit.summary.total;
  const { critical, serious, moderate, minor } = audit.summary.bySeverity;
  const { A, AA, AAA } = audit.summary.byLevel;

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all',
        isSelected ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0 cursor-pointer" onClick={onSelect}>
            <CardTitle className="text-base font-medium truncate">
              {audit.url}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDateBR(audit.timestamp)}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Ações</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onViewDetails(); }}>
                <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
                Ver detalhes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onExport(); }}>
                <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                Exportar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onOpenUrl(); }}>
                <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" />
                Abrir URL
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="secondary" className="text-xs">
            Total: {total}
          </Badge>
          {critical > 0 && (
            <Badge className={SEVERITY_COLORS.critical} variant="outline">
              {critical} Crítico
            </Badge>
          )}
          {serious > 0 && (
            <Badge className={SEVERITY_COLORS.serious} variant="outline">
              {serious} Sério
            </Badge>
          )}
          {moderate > 0 && (
            <Badge className={SEVERITY_COLORS.moderate} variant="outline">
              {moderate} Moderado
            </Badge>
          )}
          {minor > 0 && (
            <Badge className={SEVERITY_COLORS.minor} variant="outline">
              {minor} Menor
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {A > 0 && (
            <Badge className={WCAG_LEVEL_COLORS.A} variant="outline">
              A: {A}
            </Badge>
          )}
          {AA > 0 && (
            <Badge className={WCAG_LEVEL_COLORS.AA} variant="outline">
              AA: {AA}
            </Badge>
          )}
          {AAA > 0 && (
            <Badge className={WCAG_LEVEL_COLORS.AAA} variant="outline">
              AAA: {AAA}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}