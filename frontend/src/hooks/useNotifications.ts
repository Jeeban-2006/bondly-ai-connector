import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { apiFetch } from '@/lib/api';

export interface AppNotification {
  id: string;
  message: string;
  time: string;
  unread: boolean;
  icon: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const { toast } = useToast();

  const loadNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [contactsRes, interactionsRes] = await Promise.all([
        supabase.from('contacts').select('*').eq('user_id', user.id),
        supabase.from('interactions').select('*, contacts(name)').eq('user_id', user.id).order('date', { ascending: false }).limit(1),
      ]);

      const contacts = contactsRes.data || [];
      const latestInteraction = interactionsRes.data?.[0];

      const newNotifications: AppNotification[] = [];
      const today = new Date();

      // 1. Birthdays coming up in 30 days
      contacts.forEach(contact => {
        if (contact.birthday) {
          const bday = new Date(contact.birthday);
          bday.setFullYear(today.getFullYear());
          const diffTime = bday.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays >= 0 && diffDays <= 30) {
            newNotifications.push({
              id: `bday-${contact.id}`,
              message: `🎂 ${contact.name}'s birthday is in ${diffDays} days!`,
              time: 'Just now',
              unread: true,
              icon: '🎂'
            });
          }
        }
      });

      // 2. Neglected contacts (> 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
      
      contacts.forEach(contact => {
        if (contact.last_contacted) {
          const lastDate = new Date(contact.last_contacted);
          if (lastDate < sevenDaysAgo) {
            newNotifications.push({
              id: `neglect-${contact.id}`,
              message: `⚠️ You haven't contacted ${contact.name} in over a week`,
              time: 'Recent',
              unread: true,
              icon: '⚠️'
            });
          }
        }
      });

      // 3. Most recent interaction
      if (latestInteraction) {
        newNotifications.push({
          id: `inter-${latestInteraction.id}`,
          message: `✅ Interaction with ${latestInteraction.contacts?.name || 'a contact'} logged`,
          time: new Date(latestInteraction.date).toLocaleDateString(),
          unread: false,
          icon: '✅'
        });
      }

      // 4. Load Cached AI Insights
      const cachedInsights = localStorage.getItem('bondly_ai_insights');
      if (cachedInsights) {
        try {
          const insightsList = JSON.parse(cachedInsights);
          insightsList.forEach((insight: string, idx: number) => {
            newNotifications.push({
              id: `ai-insight-${idx}`,
              message: `💡 ${insight.replace(/^\d+\.\s*/, '')}`, // Remove numbering if present
              time: 'AI Insight',
              unread: true,
              icon: '💡'
            });
          });
        } catch (e) {
          console.error('Failed to parse cached insights', e);
        }
      }

      setNotifications(newNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const fetchAIInsights = async () => {
    setIsGeneratingInsights(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: contacts } = await supabase.from('contacts').select('*').eq('user_id', user.id);
      
      const data = await apiFetch<{
        success: boolean;
        insights: { wins: string[]; attention_needed: string[]; growth_opportunities: string[] };
      }>('/api/ai/insights', {
        method: 'POST',
        body: JSON.stringify({ contacts: contacts || [] }),
      });

      if (data.success && data.insights) {
        // Flatten the structured insights object into a flat array of strings
        const insightsArray: string[] = [
          ...(data.insights.wins ?? []),
          ...(data.insights.attention_needed ?? []),
          ...(data.insights.growth_opportunities ?? []),
        ].filter(Boolean);

        localStorage.setItem('bondly_ai_insights', JSON.stringify(insightsArray));
        toast({ title: 'Insights Refreshed!', description: 'Your AI notifications have been updated.' });
        loadNotifications();
      }
    } catch (error) {
      toast({ title: 'AI Generation Failed', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return { notifications, isGeneratingInsights, fetchAIInsights, loadNotifications };
};
