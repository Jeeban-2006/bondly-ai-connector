import { Heart, ArrowRight, Users, Brain, Calendar, Shield, Sparkles, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import Scene3D from '@/components/landing/Scene3D';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  { icon: Users, title: 'Track Relationships', desc: 'Never forget to check in with the people who matter most.' },
  { icon: Brain, title: 'AI-Powered Insights', desc: 'Get smart reminders and message suggestions powered by AI.' },
  { icon: Calendar, title: 'Important Dates', desc: 'Birthdays, anniversaries — always remembered, never missed.' },
  { icon: Shield, title: 'Private & Secure', desc: 'Your relationship data stays safe and encrypted.' },
];

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '1M+', label: 'Connections Made' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9★', label: 'App Rating' },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/dashboard', { replace: true });
    });
  }, [navigate]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Nav entrance
      gsap.from(navRef.current, {
        y: -80,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Hero stagger entrance
      gsap.from('.hero-badge', {
        y: 40,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
        delay: 0.3,
      });
      gsap.from('.hero-title', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.5,
      });
      gsap.from('.hero-subtitle', {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        delay: 0.7,
      });
      gsap.from('.hero-buttons', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.9,
      });

      // Preview card parallax entrance
      gsap.from(previewRef.current, {
        y: 100,
        opacity: 0,
        scale: 0.9,
        duration: 1,
        ease: 'power3.out',
        delay: 1.1,
      });

      // Preview card scroll parallax
      gsap.to(previewRef.current, {
        y: -40,
        scrollTrigger: {
          trigger: previewRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1,
        },
      });

      // Stats section
      gsap.from('.stat-item', {
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 0.7,
        ease: 'back.out(1.4)',
      });

      // Features section title
      gsap.from('.features-title', {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
      });

      // Feature cards stagger
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        y: 80,
        opacity: 0,
        rotateX: 15,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
      });

      // CTA section
      gsap.from(ctaRef.current, {
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 60,
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden" style={{ background: 'var(--gradient-bg)' }}>
      <Scene3D />

      {/* Nav */}
      <header ref={navRef} className="sticky top-0 z-50 backdrop-blur-xl border-b border-border/30 px-6 py-4">
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
      <section ref={heroRef} className="max-w-6xl mx-auto px-6 pt-12 md:pt-24 pb-16 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 hero-badge backdrop-blur-sm border border-primary/20">
          <Sparkles className="h-4 w-4" />
          AI-powered relationship care
        </div>
        <h1 className="hero-title text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-tight tracking-tight">
          Never let important<br />
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-primary)' }}>
            relationships drift away.
          </span>
        </h1>
        <p className="hero-subtitle text-lg md:text-xl text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
          Bondly helps you remember, nurture, and strengthen meaningful relationships using AI-powered insights and reminders.
        </p>
        <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Button
            size="lg"
            className="rounded-2xl btn-primary-glow border-0 text-primary-foreground h-14 px-8 text-base font-semibold group"
            onClick={() => navigate('/auth?mode=signup')}
          >
            Start for Free <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-2xl h-14 px-8 text-base border-border backdrop-blur-sm"
            onClick={() => navigate('/auth')}
          >
            Log in
          </Button>
        </div>

        {/* Mock dashboard preview */}
        <div ref={previewRef} className="mt-16">
          <div className="glass-card-static p-2 md:p-4 max-w-4xl mx-auto backdrop-blur-md">
            <div className="rounded-xl bg-card/80 p-6 md:p-8 border border-border/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['6 Contacts', '2 Birthdays', '3 Strong', '3 Attention'].map((label, i) => (
                  <div key={i} className="glass-card p-4 text-center">
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

      {/* Stats */}
      <section ref={statsRef} className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s, i) => (
            <div key={i} className="stat-item text-center p-6 glass-card-static backdrop-blur-sm">
              <div className="text-2xl md:text-3xl font-extrabold text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef} className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <h2 className="features-title text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
          Everything you need to stay connected
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="feature-card glass-card p-6 text-center backdrop-blur-sm" style={{ perspective: '800px' }}>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <f.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center relative z-10">
        <div ref={ctaRef} className="glass-card-static p-10 md:p-16 backdrop-blur-md relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ background: 'var(--gradient-primary)' }} />
          <div className="relative z-10">
            <Zap className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to strengthen your bonds?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Join Bondly and never let important relationships fade away.
            </p>
            <Button
              size="lg"
              className="rounded-2xl btn-primary-glow border-0 text-primary-foreground h-14 px-10 text-base font-semibold group"
              onClick={() => navigate('/auth?mode=signup')}
            >
              Get Started — It's Free <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 px-6 py-8 text-center relative z-10">
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <Heart className="h-4 w-4 text-primary fill-current" />
          <span>Bondly — Made with love</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
