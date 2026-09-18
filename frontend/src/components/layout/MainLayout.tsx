import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { FilterProvider } from '@/context/FilterContext';
import type { AuditMeta } from '@/types/audit';

interface MainLayoutProps {
  children: React.ReactNode;
  manifest: AuditMeta[];
}

export function MainLayout({ children, manifest }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <FilterProvider manifest={manifest}>
      <div className="min-h-screen bg-background flex">
        <Sidebar
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </FilterProvider>
  );
}