import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';

export interface UserProfile {
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    supabase
      .from('profiles')
      .select('display_name, avatar_url')
      .eq('user_id', session.user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) console.error('Profile fetch error:', error);
        setProfile({
          display_name: data?.display_name ?? session.user.user_metadata?.full_name ?? session.user.user_metadata?.name ?? null,
          avatar_url: data?.avatar_url ?? session.user.user_metadata?.avatar_url ?? null,
          email: session.user.email ?? null,
        });
        setLoading(false);
      });
  }, [session]);

  const updateProfile = async (updates: Partial<Pick<UserProfile, 'display_name'>>) => {
    if (!session) return;
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: updates.display_name, updated_at: new Date().toISOString() })
      .eq('user_id', session.user.id);
    if (!error) {
      setProfile(prev => prev ? { ...prev, ...updates } : prev);
    }
    return error;
  };

  return { profile, loading, updateProfile, session };
}
