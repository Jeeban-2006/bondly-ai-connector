import { Heart, Bell, Moon, Sun, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { getInitials, mockContacts } from '@/lib/mockData';

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  const [isDark, setIsDark] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const notifications = [
    { id: 1, message: "🎂 Sarah Chen's birthday is in 25 days!", time: "Just now", unread: true },
    { id: 2, message: "⚠️ You haven't contacted Marcus Johnson in a week", time: "2h ago", unread: true },
    { id: 3, message: "💛 Emma Rodriguez needs attention", time: "5h ago", unread: true },
    { id: 4, message: "✅ Interaction with David Kim logged", time: "Yesterday", unread: false },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <div className="relative" ref={notifRef}>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl relative"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setHasNotification(false);
            }}
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            {hasNotification && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
            )}
          </Button>

          {showNotifications && (
            <div className="fixed inset-x-4 top-16 md:absolute md:inset-x-auto md:right-0 md:top-12 md:w-80 bg-background rounded-2xl border border-border/50 shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h3 className="font-semibold text-foreground text-sm">Notifications</h3>
                <button onClick={() => setShowNotifications(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-border/30 last:border-0 hover:bg-secondary/50 transition-colors ${n.unread ? 'bg-primary/5' : ''}`}
                  >
                    <p className="text-sm text-foreground">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

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
