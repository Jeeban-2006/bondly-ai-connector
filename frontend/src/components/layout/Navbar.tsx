import { Heart, Bell, Moon, Sun, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/utils';
import { useProfile } from '@/hooks/useProfile';
import { useNotifications } from '@/hooks/useNotifications';
import { Loader2, RefreshCw } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const { profile } = useProfile();
  const notifRef = useRef<HTMLDivElement>(null);

  const { notifications, isGeneratingInsights, fetchAIInsights } = useNotifications();

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
            <div className="fixed inset-x-4 top-16 md:absolute md:inset-x-auto md:right-0 md:top-12 md:w-96 bg-background rounded-2xl border border-border/50 shadow-xl z-50 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card">
                <h3 className="font-semibold text-foreground text-sm">Notifications</h3>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2 text-xs text-primary hover:text-primary/80"
                    onClick={fetchAIInsights}
                    disabled={isGeneratingInsights}
                  >
                    {isGeneratingInsights ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <RefreshCw className="h-3 w-3 mr-1" />}
                    Refresh Insights
                  </Button>
                  <button onClick={() => setShowNotifications(false)} className="text-muted-foreground hover:text-foreground p-1">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 border-b border-border/30 last:border-0 hover:bg-secondary/50 transition-colors ${n.unread ? 'bg-primary/5' : ''}`}
                    >
                      <p className="text-sm text-foreground leading-snug">{n.message}</p>
                      <p className="text-xs text-muted-foreground mt-1.5">{n.time}</p>
                    </div>
                  ))
                )}
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

          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Profile"
              onClick={() => navigate('/settings')}
              className="w-9 h-9 rounded-xl object-cover cursor-pointer hover:opacity-90 transition-opacity"
            />
          ) : (
            <div
              onClick={() => navigate('/settings')}
              className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
            >
              {getInitials(profile?.display_name || profile?.email || 'U')}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
