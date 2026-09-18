'use client';

import { useToast } from '@/hooks/useToast';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-label="Notificações"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'pointer-events-auto flex items-start gap-3 w-[320px] rounded-lg border bg-background p-4 shadow-lg',
            t.variant === 'destructive'
              ? 'border-destructive/50 bg-destructive/10 text-destructive'
              : 'border-border'
          )}
          role="alert"
        >
          <div className="flex-1">
            <p className="font-medium">{t.title}</p>
            {t.description && <p className="text-sm opacity-90 mt-1">{t.description}</p>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={() => dismiss(t.id)}
            aria-label="Dispensar"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      ))}
    </div>
  );
}