export function formatDateBR(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function parseISODate(dateString: string): Date {
  return new Date(dateString);
}

export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export function getDateRangeOptions(): { value: string; label: string }[] {
  return [
    { value: 'today', label: 'Hoje' },
    { value: 'week', label: 'Última semana' },
    { value: 'month', label: 'Último mês' },
    { value: 'quarter', label: 'Último trimestre' },
    { value: 'year', label: 'Último ano' },
    { value: 'custom', label: 'Personalizado' },
  ];
}