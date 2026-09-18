import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Violation } from '@/types/audit';
import { SEVERITY_LABELS, SEVERITY_COLORS, WCAG_LEVEL_LABELS, WCAG_LEVEL_COLORS } from '@/utils/severity';
import { ViolationCard } from './ViolationCard';

interface ViolationAccordionProps {
  title: string;
  violations: Violation[];
  severity?: 'critical' | 'serious' | 'moderate' | 'minor';
  wcagLevel?: 'A' | 'AA' | 'AAA';
  ruleId?: string;
}

export function ViolationAccordion({
  title,
  violations,
  severity,
  wcagLevel,
  ruleId,
}: ViolationAccordionProps) {
  if (violations.length === 0) return null;

  const count = violations.length;
  const highestSeverity = severity || violations[0].severity;

  return (
    <AccordionItem value={ruleId || severity || wcagLevel || title} className="border rounded-lg overflow-hidden">
      <AccordionTrigger className={cn('flex items-center justify-between py-3 px-4', 'hover:bg-muted/50')}>
        <div className="flex items-center gap-3">
          <Badge
            className={cn(SEVERITY_COLORS[highestSeverity], 'font-medium')}
            variant="outline"
          >
            {SEVERITY_LABELS[highestSeverity]}
          </Badge>
          {wcagLevel && (
            <Badge className={WCAG_LEVEL_COLORS[wcagLevel]} variant="outline">
              {WCAG_LEVEL_LABELS[wcagLevel]}
            </Badge>
          )}
          {ruleId && (
            <span className="font-mono text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted">
              {ruleId}
            </span>
          )}
          <span className="font-medium">{title}</span>
          <Badge variant="secondary" className="ml-auto">
            {count} violação{count !== 1 ? 'ões' : ''}
          </Badge>
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </AccordionTrigger>
      <AccordionContent className="pt-0 pb-4">
        <div className="space-y-2 px-4">
          {violations.map((violation, index) => (
            <ViolationCard key={`${ruleId || severity || wcagLevel || title}-${index}`} violation={violation} index={index} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}