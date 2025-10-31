import { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { Dashboard } from './Dashboard';
import { OrdersManager } from './OrdersManager';
import { MenuManager } from './MenuManager';
import { Analytics } from './Analytics';

type Section = 'dashboard' | 'orders' | 'menu' | 'analytics';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={onLogout}
      />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {activeSection === 'dashboard' && <Dashboard />}
        {activeSection === 'orders' && <OrdersManager />}
        {activeSection === 'menu' && <MenuManager />}
        {activeSection === 'analytics' && <Analytics />}
      </main>
    </div>
  );
};
