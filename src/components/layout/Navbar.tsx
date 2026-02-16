import { Heart, Bell, Moon, Sun, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/mockData';

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  const [isDark, setIsDark] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <header className="sticky top-0 z-50 glass-card-static rounded-none border-b border-border/50 px-4 py-3 md:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-xl"
            onClick={onToggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl btn-primary-glow flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary-foreground fill-current" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">Bondly</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl relative"
            onClick={() => setHasNotification(false)}
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            {hasNotification && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl"
            onClick={() => setIsDark(!isDark)}
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Moon className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>

          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity">
            {getInitials('Alex Rivera')}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
