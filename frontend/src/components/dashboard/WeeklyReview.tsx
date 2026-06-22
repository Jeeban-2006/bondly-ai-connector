import { useState, useEffect } from 'react';
import { CalendarDays, Trophy, Users, TrendingUp, Sparkles } from 'lucide-react';
import { calculateWeeklyMetrics, WeeklyReviewData } from '@/utils/weeklyReviewEngine';
import { cn } from '@/lib/utils';

const WeeklyReview = () => {
  const [review, setReview] = useState<WeeklyReviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      const data = await calculateWeeklyMetrics();
      setReview(data);
      setLoading(false);
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return <div className="glass-card p-6 h-40 animate-pulse bg-secondary/50" />;
  }

  if (!review) {
    return (
      <div className="space-y-4 animate-in">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Weekly Relationship Review</h2>
        </div>
        <div className="glass-card p-8 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Sparkles className="w-7 h-7 text-primary opacity-60" />
          </div>
          <p className="text-sm font-medium text-foreground">Your weekly insights will appear here</p>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
            Start logging interactions with your contacts to unlock weekly relationship insights and progress tracking.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" />
          Weekly Relationship Review
        </h2>
        <span className="text-xs font-medium bg-secondary text-muted-foreground px-2.5 py-1 rounded-full">
          Week of {new Date(review.week_start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>
      </div>

      <div className="glass-card overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Trophy className="w-32 h-32" />
        </div>
        
        <div className="relative p-5">
          <p className="text-sm text-muted-foreground mb-5 flex items-start gap-2 max-w-lg">
            <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            {review.summary_text}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card/40 rounded-xl p-3 border border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs font-medium">Interactions</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {review.metrics.newInteractions}
              </div>
            </div>

            <div className="bg-card/40 rounded-xl p-3 border border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-medium">Health Change</span>
              </div>
              <div className="text-2xl font-bold text-emerald-500">
                +{review.metrics.healthScoreChange}%
              </div>
            </div>

            <div className="bg-card/40 rounded-xl p-3 border border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Trophy className="w-4 h-4 text-accent" />
                <span className="text-xs font-medium">Recoveries</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {review.metrics.relationshipRecoveries}
              </div>
            </div>

            <div className="bg-card/40 rounded-xl p-3 border border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium">Follow-ups</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {review.metrics.followUpsCompleted}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReview;
