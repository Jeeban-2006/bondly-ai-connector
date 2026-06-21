import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    // Listen for the SIGNED_IN event from the recovery link
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
      }
    });

    // Also check the URL hash for type=recovery (for page refresh cases)
    const hash = window.location.hash;
    if (hash.includes('type=recovery') || hash.includes('type=signup')) {
      setIsRecovery(true);
    }

    // Check if there's an active session (user came from recovery link)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setIsRecovery(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: 'Passwords do not match', description: 'Please make sure both passwords are the same.', variant: 'destructive' });
      return;
    }
    if (password.length < 6) {
      toast({ title: 'Password too short', description: 'Password must be at least 6 characters.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      toast({ title: '✅ Password updated!', description: 'Your password has been changed successfully.' });
      setTimeout(() => navigate('/dashboard', { replace: true }), 2500);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--gradient-bg)' }}>
      <div className="w-full max-w-md space-y-8 animate-in">
        {/* Logo */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl btn-primary-glow flex items-center justify-center mx-auto mb-4">
            <Heart className="h-7 w-7 text-primary-foreground fill-current" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {done ? 'Password Updated!' : 'Set New Password'}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {done ? 'Redirecting you to the dashboard…' : 'Choose a strong new password for your account'}
          </p>
        </div>

        <div className="glass-card-static p-8">
          {done ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <p className="text-muted-foreground text-sm text-center">
                Your password has been updated. Taking you to your dashboard…
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 rounded-xl bg-secondary/50 border-border"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 rounded-xl bg-secondary/50 border-border"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-destructive text-xs">Passwords do not match</p>
              )}

              <Button
                type="submit"
                disabled={loading || (!!password && !!confirmPassword && password !== confirmPassword)}
                className="w-full h-12 rounded-xl btn-primary-glow border-0 text-primary-foreground font-semibold"
              >
                {loading ? 'Updating…' : 'Update Password'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Remember your password?{' '}
          <button onClick={() => navigate('/auth')} className="text-primary font-medium hover:underline">
            Back to login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
