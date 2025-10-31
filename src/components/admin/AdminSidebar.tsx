import { Button } from '@/components/ui/button';
import { LayoutDashboard, ShoppingBag, Menu, BarChart3, LogOut, UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/utils';

type Section = 'dashboard' | 'orders' | 'menu' | 'analytics';

interface AdminSidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  onLogout: () => void;
}

export const AdminSidebar = ({ activeSection, onSectionChange, onLogout }: AdminSidebarProps) => {
  const menuItems = [
    { id: 'dashboard' as Section, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders' as Section, label: 'Orders', icon: ShoppingBag },
    { id: 'menu' as Section, label: 'Menu', icon: Menu },
    { id: 'analytics' as Section, label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-card border-r flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Admin Panel</h2>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeSection === item.id ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start',
                activeSection === item.id && 'bg-primary text-primary-foreground'
              )}
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className="h-4 w-4 mr-2" />
              {item.label}
            </Button>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <Button variant="outline" className="w-full justify-start" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  );
};
