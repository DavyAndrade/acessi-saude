import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Violation, Severity, WCAGLevel } from '@/types/audit';
import { SEVERITY_LABELS, WCAG_LEVEL_LABELS } from '@/utils/severity';
import { ViolationAccordion } from './ViolationAccordion';

interface ViolationListProps {
  violations: Violation[];
  grouped: {
    bySeverity: Record<Severity, Violation[]>;
    byLevel: Record<WCAGLevel, Violation[]>;
    byRule: Record<string, Violation[]>;
  };
  activeTab: 'severity' | 'level' | 'rule';
  onTabChange: (tab: 'severity' | 'level' | 'rule') => void;
}

const SEVERITIES: Severity[] = ['critical', 'serious', 'moderate', 'minor'];
const LEVELS: WCAGLevel[] = ['A', 'AA', 'AAA'];

export function ViolationList({
  violations,
  grouped,
  activeTab,
  onTabChange,
}: ViolationListProps) {
  if (violations.length === 0) {
    return (
      <Alert className="mb-4">
        <AlertDescription className="text-center py-8">
          Nenhuma violação encontrada com os filtros atuais.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={onTabChange as (value: string) => void} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="severity">Por Severidade</TabsTrigger>
          <TabsTrigger value="level">Por Nível WCAG</TabsTrigger>
          <TabsTrigger value="rule">Por Regra</TabsTrigger>
        </TabsList>

        <TabsContent value="severity">
          <ScrollArea className="h-[calc(100vh-300px)] max-h-[600px]">
            <div className="space-y-3 p-1 pr-4">
              {SEVERITIES.map((severity) => {
                const items = grouped.bySeverity[severity];
                if (items.length === 0) return null;
                return (
                  <ViolationAccordion
                    key={severity}
                    title={SEVERITY_LABELS[severity]}
                    violations={items}
                    severity={severity}
                  />
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="level">
          <ScrollArea className="h-[calc(100vh-300px)] max-h-[600px]">
            <div className="space-y-3 p-1 pr-4">
              {LEVELS.map((level) => {
                const items = grouped.byLevel[level];
                if (items.length === 0) return null;
                return (
                  <ViolationAccordion
                    key={level}
                    title={WCAG_LEVEL_LABELS[level]}
                    violations={items}
                    wcagLevel={level}
                  />
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="rule">
          <ScrollArea className="h-[calc(100vh-300px)] max-h-[600px]">
            <div className="space-y-3 p-1 pr-4">
              {Object.entries(grouped.byRule)
                .sort(([, a], [, b]) => b.length - a.length)
                .map(([ruleId, items]) => (
                  <ViolationAccordion
                    key={ruleId}
                    title={items[0]?.ruleDescription || ruleId}
                    violations={items}
                    ruleId={ruleId}
                  />
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}