import { useState, useEffect } from 'react';
import { Sparkles, Loader2, RefreshCw, AlertCircle, TrendingUp, Heart, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { apiFetch } from '@/lib/api';

interface InsightData {
  wins: string[];
  attention_needed: string[];
  growth_opportunities: string[];
}

interface DBInsight {
  id: string;
  insights_data: InsightData;
  created_at: string;
}

const RelationshipPulse = () => {
  const [insight, setInsight] = useState<DBInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchExistingInsight = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        // Check if older than 24h
        const createdDate = new Date(data[0].created_at);
        const now = new Date();
        const isOld = (now.getTime() - createdDate.getTime()) > (24 * 60 * 60 * 1000);
        
        setInsight(data[0] as DBInsight);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExistingInsight();
  }, []);

  const handleRefresh = async () => {
    setGenerating(true);
    setAiError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: contacts } = await supabase.from('contacts').select('*').eq('user_id', user.id);
      
      const resData = await apiFetch<{ success: boolean; insights: InsightData }>('/api/ai/insights', {
        method: 'POST',
        body: JSON.stringify({ contacts: contacts || [] }),
      });

      const insightsData = resData.insights;

      // Save to Supabase
      const { data: inserted, error } = await supabase
        .from('ai_insights')
        .insert({ user_id: user.id, insights_data: insightsData })
        .select()
        .single();

      if (error) throw error;
      
      setInsight(inserted as DBInsight);
      toast({ title: 'Insights Refreshed!', description: 'Your relationship pulse is up to date.' });
    } catch (e) {
      const msg = (e as Error).message ?? 'Unable to generate insights right now. Please try again later.';
      setAiError(msg);
      toast({ title: 'Refresh Failed', description: msg, variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <div className="glass-card p-6 h-48 animate-pulse bg-secondary/50" />;
  }

  const renderSection = (title: string, items: string[], icon: React.ReactNode, colorClass: string) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="space-y-2">
        <h4 className={cn("text-xs font-bold uppercase tracking-wider flex items-center gap-1.5", colorClass)}>
          {icon}
          {title}
        </h4>
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="text-sm text-foreground/90 leading-snug bg-card/50 rounded-lg p-2.5 border border-border/50">
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="glass-card overflow-hidden animate-in relative group">
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent pointer-events-none" />
      
      <div className="relative p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl drop-shadow-sm">💛</span> 
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Relationship Pulse</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {insight ? `Last updated: ${new Date(insight.created_at).toLocaleString()}` : 'No insights generated yet'}
            </p>
          </div>
          
          <Button 
            onClick={handleRefresh} 
            disabled={generating}
            variant="outline"
            className="rounded-xl border-border hover:bg-primary/5 hover:text-primary transition-all shadow-sm"
          >
            {generating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin text-primary" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2 text-primary" />
            )}
            {insight ? 'Refresh Insights' : 'Generate Insights'}
          </Button>
        </div>

        {!insight ? (
          <div className="py-10 text-center">
            {aiError ? (
              <div className="space-y-3">
                <WifiOff className="w-10 h-10 mx-auto text-muted-foreground opacity-40" />
                <p className="text-sm font-medium text-foreground">Unable to generate insights right now</p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">Please check that your backend is running and try again later.</p>
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={generating} className="mt-2 rounded-xl">
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Try Again
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Sparkles className="w-10 h-10 mx-auto opacity-20" />
                <p className="text-sm font-medium text-foreground">Generate your first Relationship Pulse</p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">Discover hidden patterns in your relationships using AI-powered analysis.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {renderSection("Attention Needed", insight.insights_data.attention_needed, <AlertCircle className="w-3.5 h-3.5" />, "text-rose-500")}
            {renderSection("Relationship Wins", insight.insights_data.wins, <Heart className="w-3.5 h-3.5" />, "text-emerald-500")}
            {renderSection("Growth Opportunities", insight.insights_data.growth_opportunities, <TrendingUp className="w-3.5 h-3.5" />, "text-primary")}
          </div>
        )}
      </div>
    </div>
  );
};

export default RelationshipPulse;
