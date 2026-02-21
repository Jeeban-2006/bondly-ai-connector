import { Heart, ArrowRight, Users, Brain, Calendar, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const features = [
  { icon: Users, title: 'Track Relationships', desc: 'Never forget to check in with the people who matter most.' },
  { icon: Brain, title: 'AI-Powered Insights', desc: 'Get smart reminders and message suggestions powered by AI.' },
  { icon: Calendar, title: 'Important Dates', desc: 'Birthdays, anniversaries — always remembered, never missed.' },
  { icon: Shield, title: 'Private & Secure', desc: 'Your relationship data stays safe and encrypted.' },
];

const LandingPage = () => {
  const navigate = useNavigate();

  // If already logged in, go straight to dashboard
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/dashboard', { replace: true });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background" style={{ background: 'var(--gradient-bg)' }}>
      {/* Nav */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-border/30 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl btn-primary-glow flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary-foreground fill-current" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">Bondly</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="rounded-xl" onClick={() => navigate('/auth')}>
              Log in
            </Button>
            <Button className="rounded-xl btn-primary-glow border-0 text-primary-foreground" onClick={() => navigate('/auth?mode=signup')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-12 md:pt-20 pb-16 text-center">
        <div className="stagger-children">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Heart className="h-4 w-4 fill-current" />
            AI Relationship Manager
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-tight tracking-tight">
            Nurture the bonds<br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-primary)' }}>
              that matter most
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
            Bondly helps you stay connected with friends, family, and colleagues through intelligent reminders and AI-powered insights.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Button
              size="lg"
              className="rounded-2xl btn-primary-glow border-0 text-primary-foreground h-14 px-8 text-base font-semibold"
              onClick={() => navigate('/auth?mode=signup')}
            >
              Start for Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-2xl h-14 px-8 text-base border-border"
              onClick={() => navigate('/auth')}
            >
              Log in
            </Button>
          </div>
        </div>

        {/* Mock dashboard preview */}
        <div className="mt-16 animate-in animate-in-delay-2">
          <div className="glass-card-static p-2 md:p-4 max-w-4xl mx-auto">
            <div className="rounded-xl bg-card/80 p-6 md:p-8 border border-border/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['6 Contacts', '2 Birthdays', '3 Strong', '3 Attention'].map((label, i) => (
                  <div key={i} className="glass-card-static p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">{label.split(' ')[0]}</div>
                    <div className="text-xs text-muted-foreground mt-1">{label.split(' ')[1]}</div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-6 italic">"Relationships grow when nurtured." 💛</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
          Everything you need to stay connected
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="glass-card p-6 text-center animate-in" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <div className="glass-card-static p-10 md:p-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to strengthen your bonds?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Join Bondly and never let important relationships fade away.
          </p>
          <Button
            size="lg"
            className="rounded-2xl btn-primary-glow border-0 text-primary-foreground h-14 px-10 text-base font-semibold"
            onClick={() => navigate('/auth?mode=signup')}
          >
            Get Started — It's Free <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <Heart className="h-4 w-4 text-primary fill-current" />
          <span>Bondly — Made with love</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
