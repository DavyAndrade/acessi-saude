import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { X, Filter, Calendar as CalendarIcon, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FilterState, WCAGLevel, Severity } from '@/types/audit';
import { WCAG_LEVEL_LABELS, SEVERITY_LABELS } from '@/utils/severity';

interface FilterBarProps {
  filters: FilterState;
  hasActiveFilters: boolean;
  onWcagChange: (levels: WCAGLevel[]) => void;
  onSeverityChange: (severities: Severity[]) => void;
  onDateRangeChange: (range: { from: string | null; to: string | null }) => void;
  onSearchChange: (search: string) => void;
  onClear: () => void;
}

const WCAG_LEVELS: WCAGLevel[] = ['A', 'AA', 'AAA'];
const SEVERITIES: Severity[] = ['critical', 'serious', 'moderate', 'minor'];

export function FilterBar({
  filters,
  hasActiveFilters,
  onWcagChange,
  onSeverityChange,
  onDateRangeChange,
  onSearchChange,
  onClear,
}: FilterBarProps) {
  const [wcagOpen, setWcagOpen] = useState(false);
  const [severityOpen, setSeverityOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState(filters.dateRange.from || '');
  const [dateTo, setDateTo] = useState(filters.dateRange.to || '');
  const wcagButtonRef = useRef<HTMLButtonElement>(null);
  const severityButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wcagButtonRef.current && !wcagButtonRef.current.contains(event.target as Node)) {
        setWcagOpen(false);
      }
      if (severityButtonRef.current && !severityButtonRef.current.contains(event.target as Node)) {
        setSeverityOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleWcagToggle = (level: WCAGLevel) => {
    const newLevels = filters.wcagLevels.includes(level)
      ? filters.wcagLevels.filter((l) => l !== level)
      : [...filters.wcagLevels, level];
    onWcagChange(newLevels);
  };

  const handleSeverityToggle = (severity: Severity) => {
    const newSeverities = filters.severities.includes(severity)
      ? filters.severities.filter((s) => s !== severity)
      : [...filters.severities, severity];
    onSeverityChange(newSeverities);
  };

  const handleDateApply = () => {
    onDateRangeChange({ from: dateFrom || null, to: dateTo || null });
  };

  const handleDateClear = () => {
    setDateFrom('');
    setDateTo('');
    onDateRangeChange({ from: null, to: null });
  };

  return (
    <div className="flex flex-col gap-4 p-4 border-b bg-card">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <Input
          placeholder="Filtrar por URL..."
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 max-w-xs"
          aria-label="Buscar por URL"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Popover open={wcagOpen} onOpenChange={setWcagOpen}>
          <PopoverTrigger>
            <Button
              variant="outline"
              className={cn('gap-2', filters.wcagLevels.length > 0 && 'bg-primary/10 text-primary border-primary/20')}
              ref={wcagButtonRef}
            >
              <Filter className="h-4 w-4" aria-hidden="true" />
              <span>WCAG</span>
              {filters.wcagLevels.length > 0 && (
                <span className="flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                  {filters.wcagLevels.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" side="bottom" align="start">
            <div className="flex items-center justify-between px-2 py-1">
              <p className="text-xs font-medium text-muted-foreground">Níveis WCAG</p>
              {filters.wcagLevels.length > 0 && (
                <Button variant="ghost" size="xs" onClick={() => onWcagChange([])}>
                  Limpar
                </Button>
              )}
            </div>
            <div className="space-y-1">
              {WCAG_LEVELS.map((level) => (
                <label key={level} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent cursor-pointer">
                  <Checkbox
                    checked={filters.wcagLevels.includes(level)}
                    onCheckedChange={() => handleWcagToggle(level)}
                    aria-label={WCAG_LEVEL_LABELS[level]}
                  />
                  <span className="text-sm">{WCAG_LEVEL_LABELS[level]}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={severityOpen} onOpenChange={setSeverityOpen}>
          <PopoverTrigger>
            <Button
              variant="outline"
              className={cn('gap-2', filters.severities.length > 0 && 'bg-primary/10 text-primary border-primary/20')}
              ref={severityButtonRef}
            >
              <Filter className="h-4 w-4" aria-hidden="true" />
              <span>Severidade</span>
              {filters.severities.length > 0 && (
                <span className="flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                  {filters.severities.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" side="bottom" align="start">
            <div className="flex items-center justify-between px-2 py-1">
              <p className="text-xs font-medium text-muted-foreground">Severidades</p>
              {filters.severities.length > 0 && (
                <Button variant="ghost" size="xs" onClick={() => onSeverityChange([])}>
                  Limpar
                </Button>
              )}
            </div>
            <div className="space-y-1">
              {SEVERITIES.map((severity) => (
                <label key={severity} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent cursor-pointer">
                  <Checkbox
                    checked={filters.severities.includes(severity)}
                    onCheckedChange={() => handleSeverityToggle(severity)}
                    aria-label={SEVERITY_LABELS[severity]}
                  />
                  <span className="text-sm capitalize">{SEVERITY_LABELS[severity]}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger>
            <Button
              variant="outline"
              className={cn('gap-2', (filters.dateRange.from || filters.dateRange.to) && 'bg-primary/10 text-primary border-primary/20')}
            >
              <CalendarIcon className="h-4 w-4" aria-hidden="true" />
              <span>Período</span>
              {(filters.dateRange.from || filters.dateRange.to) && (
                <span className="flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                  {(filters.dateRange.from ? 1 : 0) + (filters.dateRange.to ? 1 : 0)}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-2" side="bottom" align="start">
            <div className="flex items-center justify-between px-2 py-1">
              <p className="text-xs font-medium text-muted-foreground">Intervalo de datas</p>
              {(filters.dateRange.from || filters.dateRange.to) && (
                <Button variant="ghost" size="xs" onClick={handleDateClear}>
                  Limpar
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 px-2">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">De</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="text-sm"
                  aria-label="Data inicial"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Até</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="text-sm"
                  aria-label="Data final"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-2 py-2">
              <Button variant="outline" size="sm" onClick={handleDateApply}>
                Aplicar
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClear} className="gap-1">
            <X className="h-4 w-4" aria-hidden="true" />
            Limpar filtros
          </Button>
        )}
      </div>
    </div>
  );
}