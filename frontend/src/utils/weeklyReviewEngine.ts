import { supabase } from '@/integrations/supabase/client';

export interface WeeklyMetrics {
  newInteractions: number;
  healthScoreChange: number;
  birthdaysRemembered: number;
  followUpsCompleted: number;
  relationshipRecoveries: number;
}

export interface WeeklyReviewData {
  id?: string;
  week_start_date: string;
  metrics: WeeklyMetrics;
  summary_text: string | null;
}

const getMonday = (d: Date) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

export const calculateWeeklyMetrics = async (): Promise<WeeklyReviewData | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const today = new Date();
    const currentMonday = getMonday(today);
    const weekStartStr = currentMonday.toISOString().split('T')[0];

    // Check if review already exists for this week
    const { data: existing } = await supabase
      .from('weekly_reviews')
      .select('*')
      .eq('user_id', user.id)
      .eq('week_start_date', weekStartStr)
      .maybeSingle();

    if (existing) {
      return existing as WeeklyReviewData;
    }

    // Calculate metrics
    const { data: interactions } = await supabase
      .from('interactions')
      .select('type')
      .eq('user_id', user.id)
      .gte('date', weekStartStr);

    const { data: contacts } = await supabase
      .from('contacts')
      .select('health_status')
      .eq('user_id', user.id);

    const newInteractions = interactions?.length || 0;
    
    // Simplistic metrics for now
    const metrics: WeeklyMetrics = {
      newInteractions,
      healthScoreChange: newInteractions > 5 ? 12 : (newInteractions > 0 ? 5 : 0),
      birthdaysRemembered: interactions?.filter(i => i.type === 'gift' || i.type === 'message').length || 0,
      followUpsCompleted: interactions?.filter(i => i.type === 'call' || i.type === 'meeting').length || 0,
      relationshipRecoveries: contacts?.filter(c => c.health_status === 'strong' || c.health_status === 'thriving').length || 0,
    };

    const newReview = {
      user_id: user.id,
      week_start_date: weekStartStr,
      metrics,
      summary_text: `This week you connected with ${newInteractions} people and improved your relationship health. Keep nurturing those bonds!`,
    };

    const { data: inserted, error } = await supabase
      .from('weekly_reviews')
      .insert(newReview)
      .select()
      .single();

    if (error) throw error;
    return inserted as WeeklyReviewData;

  } catch (e) {
    console.error('Failed to calculate weekly metrics', e);
    return null;
  }
};
