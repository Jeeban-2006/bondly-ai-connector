import { useState } from 'react';
import { User, Bell, Shield, Palette, Moon, Sun, Save, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const SettingsPage = () => {
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex@example.com');
  const [reminderDays, setReminderDays] = useState('7');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    birthdayReminder: true,
    checkInReminder: true,
    weeklyDigest: false,
  });

  const handleSave = () => {
    setSaved(true);
    toast({ title: '✅ Settings saved!', description: 'Your preferences have been updated.' });
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    {
      id: 'profile',
      icon: User,
      title: 'Profile',
      description: 'Your personal information',
    },
    {
      id: 'notifications',
      icon: Bell,
      title: 'Notifications',
      description: 'How you want to be reminded',
    },
    {
      id: 'preferences',
      icon: Palette,
      title: 'Preferences',
      description: 'Customize your experience',
    },
    {
      id: 'privacy',
      icon: Shield,
      title: 'Privacy & Data',
      description: 'Manage your data',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="animate-in">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className="glass-card-static p-6 space-y-5 animate-in animate-in-delay-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Profile</h2>
            <p className="text-xs text-muted-foreground">Your personal information</p>
          </div>
        </div>
        <Separator className="bg-border" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl h-11 bg-card border-border" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl h-11 bg-card border-border" />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card-static p-6 space-y-5 animate-in animate-in-delay-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Bell className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Notifications</h2>
            <p className="text-xs text-muted-foreground">How you want to be reminded</p>
          </div>
        </div>
        <Separator className="bg-border" />
        <div className="space-y-4">
          {[
            { key: 'email', label: 'Email notifications', desc: 'Receive reminders via email' },
            { key: 'push', label: 'Push notifications', desc: 'Get notified in your browser' },
            { key: 'birthdayReminder', label: 'Birthday reminders', desc: 'Never miss a birthday' },
            { key: 'checkInReminder', label: 'Check-in reminders', desc: 'When relationships need attention' },
            { key: 'weeklyDigest', label: 'Weekly digest', desc: 'Summary of your relationship health' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch
                checked={notifications[item.key as keyof typeof notifications]}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, [item.key]: checked }))}
              />
            </div>
          ))}
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Remind me after (days without contact)</label>
          <Input
            type="number"
            value={reminderDays}
            onChange={(e) => setReminderDays(e.target.value)}
            className="rounded-xl h-11 bg-card border-border w-32"
            min={1}
            max={90}
          />
        </div>
      </div>

      {/* Preferences */}
      <div className="glass-card-static p-6 space-y-5 animate-in animate-in-delay-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
            <Palette className="h-5 w-5 text-success" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Preferences</h2>
            <p className="text-xs text-muted-foreground">Customize your experience</p>
          </div>
        </div>
        <Separator className="bg-border" />
        <p className="text-sm text-muted-foreground">Theme can be toggled using the moon/sun icon in the top navigation bar.</p>
      </div>

      {/* Privacy */}
      <div className="glass-card-static p-6 space-y-5 animate-in animate-in-delay-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-warning" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Privacy & Data</h2>
            <p className="text-xs text-muted-foreground">Manage your data</p>
          </div>
        </div>
        <Separator className="bg-border" />
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="rounded-xl border-border">Export My Data</Button>
          <Button variant="outline" className="rounded-xl border-destructive text-destructive hover:bg-destructive/10">Delete All Data</Button>
        </div>
      </div>

      {/* Save */}
      <Button
        onClick={handleSave}
        disabled={saved}
        className={cn(
          "w-full h-12 rounded-xl text-primary-foreground border-0 font-semibold",
          saved ? "bg-success" : "btn-primary-glow"
        )}
      >
        {saved ? <><Check className="h-5 w-5 mr-2" /> Saved!</> : <><Save className="h-5 w-5 mr-2" /> Save Settings</>}
      </Button>
    </div>
  );
};

export default SettingsPage;
