import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, ChevronRight, Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Violation } from '@/types/audit';
import { SEVERITY_LABELS, SEVERITY_COLORS, WCAG_LEVEL_LABELS, WCAG_LEVEL_COLORS } from '@/utils/severity';
import { getLBIArticle } from '@/utils/lbi';
import { useToast } from '@/hooks/useToast';

interface ViolationCardProps {
  violation: Violation;
  index: number;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function ViolationCard({
  violation,
  index,
  isExpanded = false,
  onToggle,
}: ViolationCardProps) {
  const [copied, setCopied] = useState(false);
  const lbiArticle = getLBIArticle(violation.ruleId);
  const { toast } = useToast();

  const handleCopy = async () => {
    const text = violation.nodes[0]?.html || '';
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Erro ao copiar',
        description: 'Não foi possível copiar o trecho de código',
        variant: 'destructive',
      });
    }
  };

  const rawHtmlSnippet = violation.nodes[0]?.html || 'N/A';
  const targetSelector = violation.nodes[0]?.target.join(', ') || 'N/A';

  const htmlSnippet = rawHtmlSnippet
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#039;');

  return (
    <div className={cn('border rounded-lg overflow-hidden', isExpanded ? 'bg-muted/30' : '')}>
      <div
        className={cn(
          'flex items-center gap-3 p-4 cursor-pointer transition-colors',
          isExpanded ? 'bg-muted/50' : 'hover:bg-muted/30'
        )}
        onClick={onToggle}
      >
        <div className="flex-shrink-0 w-8 text-center text-muted-foreground text-sm font-mono">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={cn(SEVERITY_COLORS[violation.severity], 'font-medium')} variant="outline">
              {SEVERITY_LABELS[violation.severity]}
            </Badge>
            <Badge className={WCAG_LEVEL_COLORS[violation.wcagLevel]} variant="outline">
              {WCAG_LEVEL_LABELS[violation.wcagLevel]}
            </Badge>
            <span className="font-mono text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted">
              {violation.ruleId}
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-foreground truncate">
            {violation.ruleDescription}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => { e.stopPropagation(); handleCopy(); }}
            aria-label={copied ? 'Copiado!' : 'Copiar trecho de código'}
          >
            <Copy className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => { e.stopPropagation(); window.open(violation.helpUrl, '_blank'); }}
            aria-label="Ver documentação"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </Button>
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          ) : (
            <ChevronRight className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t p-4 space-y-4 bg-background">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Ajuda</h4>
            <p className="text-sm text-foreground">{violation.help}</p>
            <a
              href={violation.helpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-2"
            >
              Ver documentação completa
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>

          {lbiArticle && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                <strong>LBI (Lei Brasileira de Inclusão):</strong> {lbiArticle}
              </p>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Trecho de código</h4>
            <ScrollArea className="h-40 rounded-md border">
              <pre className="p-3 text-xs overflow-x-auto font-mono text-foreground bg-muted/50">
                <code>{htmlSnippet}</code>
              </pre>
            </ScrollArea>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={handleCopy}
              disabled={copied}
            >
              {copied ? 'Copiado!' : 'Copiar código'}
            </Button>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Seletor alvo</h4>
            <p className="text-xs text-muted-foreground font-mono break-all">{targetSelector}</p>
          </div>

          {violation.wcagTags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Tags WCAG</h4>
              <div className="flex flex-wrap gap-1">
                {violation.wcagTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}