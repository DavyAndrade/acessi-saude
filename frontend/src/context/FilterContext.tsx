import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import type { AuditMeta, FilterState, WCAGLevel, Severity } from '@/types/audit';

const INITIAL_FILTERS: FilterState = {
  wcagLevels: [],
  severities: [],
  dateRange: { from: null, to: null },
  search: '',
};

interface FilterContextType {
  filters: FilterState;
  filteredManifest: AuditMeta[];
  setWcagLevels: (levels: WCAGLevel[]) => void;
  toggleWcagLevel: (level: WCAGLevel) => void;
  setSeverities: (severities: Severity[]) => void;
  toggleSeverity: (severity: Severity) => void;
  setDateRange: (range: { from: string | null; to: string | null }) => void;
  setSearch: (search: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const FilterContext = createContext<FilterContextType | null>(null);

export function FilterProvider({ children, manifest }: { children: ReactNode; manifest: AuditMeta[] }) {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  const filteredManifest = useMemo(() => {
    return manifest.filter((audit) => {
      if (filters.wcagLevels.length > 0) {
        const hasLevel = filters.wcagLevels.some((level) =>
          audit.summary.byLevel[level] > 0
        );
        if (!hasLevel) return false;
      }

      if (filters.severities.length > 0) {
        const hasSeverity = filters.severities.some((sev) =>
          audit.summary.bySeverity[sev] > 0
        );
        if (!hasSeverity) return false;
      }

      if (filters.dateRange.from) {
        const auditDate = new Date(audit.timestamp);
        const fromDate = new Date(filters.dateRange.from);
        if (auditDate < fromDate) return false;
      }

      if (filters.dateRange.to) {
        const auditDate = new Date(audit.timestamp);
        const toDate = new Date(filters.dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        if (auditDate > toDate) return false;
      }

      if (filters.search.trim()) {
        const searchLower = filters.search.toLowerCase();
        if (!audit.url.toLowerCase().includes(searchLower)) return false;
      }

      return true;
    });
  }, [manifest, filters]);

  const setWcagLevels = useCallback((levels: WCAGLevel[]) => {
    setFilters((prev) => ({ ...prev, wcagLevels: levels }));
  }, []);

  const toggleWcagLevel = useCallback((level: WCAGLevel) => {
    setFilters((prev) => ({
      ...prev,
      wcagLevels: prev.wcagLevels.includes(level)
        ? prev.wcagLevels.filter((l) => l !== level)
        : [...prev.wcagLevels, level],
    }));
  }, []);

  const setSeverities = useCallback((severities: Severity[]) => {
    setFilters((prev) => ({ ...prev, severities }));
  }, []);

  const toggleSeverity = useCallback((severity: Severity) => {
    setFilters((prev) => ({
      ...prev,
      severities: prev.severities.includes(severity)
        ? prev.severities.filter((s) => s !== severity)
        : [...prev.severities, severity],
    }));
  }, []);

  const setDateRange = useCallback((range: { from: string | null; to: string | null }) => {
    setFilters((prev) => ({ ...prev, dateRange: range }));
  }, []);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.wcagLevels.length > 0 ||
      filters.severities.length > 0 ||
      filters.dateRange.from !== null ||
      filters.dateRange.to !== null ||
      filters.search.trim() !== ''
    );
  }, [filters]);

  return (
    <FilterContext.Provider
      value={{
        filters,
        filteredManifest,
        setWcagLevels,
        toggleWcagLevel,
        setSeverities,
        toggleSeverity,
        setDateRange,
        setSearch,
        clearFilters,
        hasActiveFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters deve ser usado dentro de FilterProvider');
  }
  return context;
}