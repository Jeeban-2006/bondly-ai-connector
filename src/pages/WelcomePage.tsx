import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const WelcomePage = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0); // 0: heart, 1: text, 2: sparkles, 3: redirect
  const [userName, setUserName] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth', { replace: true });
        return;
      }
      const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Friend';
      setUserName(name);
    });
  }, [navigate]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => setPhase(3), 3200);
    const t4 = setTimeout(() => navigate('/dashboard', { replace: true }), 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [navigate]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50" style={{ background: 'var(--gradient-bg)' }}>
      {/* Pulsing background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 transition-all duration-[2000ms]"
          style={{
            background: 'var(--gradient-primary)',
            transform: `translate(-50%, -50%) scale(${phase >= 1 ? 1.5 : 0.5})`,
            opacity: phase >= 3 ? 0 : 0.1,
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-10 transition-all duration-[1500ms] delay-300"
          style={{
            background: 'var(--gradient-accent)',
            transform: `translate(-50%, -50%) scale(${phase >= 1 ? 1.3 : 0.3})`,
            opacity: phase >= 3 ? 0 : 0.08,
          }}
        />
      </div>

      {/* Heart icon */}
      <div
        className="relative z-10 transition-all duration-700 ease-out"
        style={{
          transform: `scale(${phase === 0 ? 0 : phase <= 2 ? 1 : 1.2})`,
          opacity: phase === 0 ? 0 : phase >= 3 ? 0 : 1,
        }}
      >
        <div className="w-20 h-20 rounded-3xl btn-primary-glow flex items-center justify-center" style={{ animation: 'pulse-ring 2s ease-in-out infinite' }}>
          <Heart className="h-10 w-10 text-primary-foreground fill-current" />
        </div>
      </div>

      {/* Welcome text */}
      <div
        className="relative z-10 text-center mt-8 transition-all duration-700 ease-out"
        style={{
          transform: `translateY(${phase >= 1 ? 0 : 20}px)`,
          opacity: phase >= 1 && phase < 3 ? 1 : 0,
        }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Welcome, {userName}! 👋
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">Setting up your space...</p>
      </div>

      {/* Sparkles */}
      <div
        className="relative z-10 mt-6 transition-all duration-500 ease-out"
        style={{
          transform: `scale(${phase >= 2 ? 1 : 0})`,
          opacity: phase >= 2 && phase < 3 ? 1 : 0,
        }}
      >
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5 animate-pulse" />
          <span className="text-sm font-medium">Ready to nurture your bonds</span>
          <Sparkles className="h-5 w-5 animate-pulse" />
        </div>
      </div>

      {/* Fade-out overlay */}
      <div
        className="absolute inset-0 bg-background z-20 transition-opacity duration-600"
        style={{ opacity: phase >= 3 ? 1 : 0, pointerEvents: 'none' }}
      />
    </div>
  );
};

export default WelcomePage;
