import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { X, Filter } from 'lucide-react';
import { FilterBar } from '@/components/audit/FilterBar';
import { useFilters } from '@/context/FilterContext';

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const {
    filters,
    hasActiveFilters,
    setWcagLevels,
    setSeverities,
    setDateRange,
    setSearch,
    clearFilters,
  } = useFilters();

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger>
          <button
            className="lg:hidden fixed bottom-4 right-4 z-40 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg"
            aria-label="Abrir filtros"
          >
            <Filter className="h-6 w-6" aria-hidden="true" />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-[10px] font-medium flex items-center justify-center text-white">
                {(
                  filters.wcagLevels.length +
                  filters.severities.length +
                  (filters.dateRange.from ? 1 : 0) +
                  (filters.dateRange.to ? 1 : 0) +
                  (filters.search ? 1 : 0)
                )}
              </span>
            )}
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-md p-0">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Filtros</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1 rounded hover:bg-muted transition-colors"
              aria-label="Fechar filtros"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <FilterBar
            filters={filters}
            hasActiveFilters={hasActiveFilters}
            onWcagChange={setWcagLevels}
            onSeverityChange={setSeverities}
            onDateRangeChange={setDateRange}
            onSearchChange={setSearch}
            onClear={clearFilters}
          />
        </SheetContent>
      </Sheet>

      <aside className="hidden lg:block w-80 border-r bg-card flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Filtros</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          <FilterBar
            filters={filters}
            hasActiveFilters={hasActiveFilters}
            onWcagChange={setWcagLevels}
            onSeverityChange={setSeverities}
            onDateRangeChange={setDateRange}
            onSearchChange={setSearch}
            onClear={clearFilters}
          />
        </div>
      </aside>
    </>
  );
}