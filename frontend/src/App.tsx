import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toast';
import { AuditProvider } from '@/context/AuditContext';
import { ToastProvider } from '@/hooks/useToast';
import { MainLayout } from '@/components/layout/MainLayout';
import { AuditDashboard } from '@/pages/AuditDashboard';
import { useReports } from '@/hooks/useReports';

function AppContent() {
  const { manifest } = useReports();

  return (
    <MainLayout manifest={manifest}>
      <AuditDashboard />
    </MainLayout>
  );
}

function App() {
  return (
    <TooltipProvider>
      <ToastProvider>
        <AuditProvider>
          <AppContent />
          <Toaster />
        </AuditProvider>
      </ToastProvider>
    </TooltipProvider>
  );
}

export default App;