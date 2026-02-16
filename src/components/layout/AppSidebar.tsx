import { LayoutDashboard, UserPlus, Users, CalendarHeart, Settings, X, Heart } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/add-contact', icon: UserPlus, label: 'Add Contact' },
  { to: '/contacts', icon: Users, label: 'All Contacts' },
  { to: '/calendar', icon: CalendarHeart, label: 'Calendar' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const AppSidebar = ({ isOpen, onClose }: AppSidebarProps) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 glass-card-static rounded-none border-r border-border/50 p-4 transition-transform duration-300 ease-in-out md:sticky md:top-[65px] md:z-30 md:h-[calc(100vh-65px)] md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile close + logo */}
        <div className="flex items-center justify-between mb-8 md:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl btn-primary-glow flex items-center justify-center">
              <Heart className="h-4 w-4 text-primary-foreground fill-current" />
            </div>
            <span className="text-lg font-bold text-foreground">Bondly</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
                style={isActive ? { boxShadow: 'var(--shadow-primary)' } : undefined}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <div className="glass-card-static p-4 text-center">
            <p className="text-xs text-muted-foreground italic leading-relaxed">
              "Relationships grow<br />when nurtured." 💛
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
