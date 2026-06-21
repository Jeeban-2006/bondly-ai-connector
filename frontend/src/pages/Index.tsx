import { useEffect, useState } from 'react';
import { Users, Cake, HeartHandshake, AlertCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '@/components/dashboard/StatsCard';
import ContactCheckInCard, { DashboardContact } from '@/components/dashboard/ContactCheckInCard';
import RelationshipPulse from '@/components/dashboard/RelationshipPulse';
import WeeklyReview from '@/components/dashboard/WeeklyReview';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/useProfile';
import { Skeleton } from '@/components/ui/skeleton';

const getUpcomingBirthdays = (contacts: { birthday: string | null }[]) => {
  const today = new Date();
  const in30Days = new Date(today);
  in30Days.setDate(today.getDate() + 30);

  return contacts.filter(c => {
    if (!c.birthday) return false;
    const bday = new Date(c.birthday);
    const thisYear = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
    const nextYear = new Date(today.getFullYear() + 1, bday.getMonth(), bday.getDate());
    return (thisYear >= today && thisYear <= in30Days) || (nextYear >= today && nextYear <= in30Days);
  }).length;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [contacts, setContacts] = useState<(DashboardContact & { birthday: string | null })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select('id, name, relationship_type, health_score, health_status, last_contacted, avatar_url, birthday')
        .order('health_score', { ascending: true }); // worst health first (needs attention)
      if (!error && data) setContacts(data);
      setLoading(false);
    };
    fetchContacts();
  }, []);

  const needsAttention = contacts.filter(c => c.health_status !== 'strong');
  const strongConnections = contacts.filter(c => c.health_status === 'strong');
  const upcomingBirthdays = getUpcomingBirthdays(contacts);

  const firstName = profile?.display_name?.split(' ')[0] ?? profile?.email?.split('@')[0] ?? 'there';

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome */}
      <div className="animate-in">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Good to see you, {firstName} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          {loading ? (
            <Skeleton className="h-4 w-56 inline-block" />
          ) : needsAttention.length === 0 ? (
            <>All your relationships are in great shape 💛</>
          ) : (
            <>You have <span className="text-accent font-semibold">{needsAttention.length} relationships</span> needing attention 💛</>
          )}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card p-5 animate-pulse">
              <div className="h-4 bg-secondary rounded w-3/4 mb-2" />
              <div className="h-8 bg-secondary rounded w-1/3" />
            </div>
          ))
        ) : (
          <>
            <StatsCard icon={Users} label="Total Contacts" value={contacts.length} variant="primary" animationDelay="0.1s" />
            <StatsCard icon={Cake} label="Upcoming Birthdays" value={upcomingBirthdays} variant="accent" animationDelay="0.15s" />
            <StatsCard icon={HeartHandshake} label="Strong Connections" value={strongConnections.length} variant="success" animationDelay="0.2s" />
            <StatsCard icon={AlertCircle} label="Needs Attention" value={needsAttention.length} variant="warning" animationDelay="0.25s" />
          </>
        )}
      </div>

      {/* Relationship Pulse (AI Dashboard) */}
      <RelationshipPulse />

      {/* People to Check In With */}
      <div>
        <div className="flex items-center justify-between mb-4 mt-8">
          <div>
            <h2 className="text-lg font-semibold text-foreground">People Needing Attention</h2>
            <p className="text-sm text-muted-foreground">
              {needsAttention.length > 0 ? "It's been a while — maybe send some love?" : "Everyone's connected — nice work!"}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-card-static p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-secondary rounded w-1/3" />
                    <div className="h-3 bg-secondary rounded w-1/2" />
                    <div className="h-1.5 bg-secondary rounded w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-16 glass-card-static animate-in">
            <p className="text-5xl mb-3">👥</p>
            <p className="text-lg font-semibold text-foreground">No contacts yet</p>
            <p className="text-sm text-muted-foreground mt-1">Add your first contact to start nurturing your bonds</p>
            <Button
              onClick={() => navigate('/add-contact')}
              className="mt-4 rounded-xl btn-primary-glow border-0 text-primary-foreground"
            >
              <Plus className="h-4 w-4 mr-2" /> Add First Contact
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.map((contact, i) => (
              <ContactCheckInCard
                key={contact.id}
                contact={contact}
                animationDelay={`${0.3 + i * 0.05}s`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Weekly Review */}
      <div className="pt-4">
        <WeeklyReview />
      </div>

      {/* Floating Add Button */}
      <Button
        onClick={() => navigate('/add-contact')}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-2xl btn-primary-glow border-0 shadow-2xl z-40"
        size="icon"
      >
        <Plus className="h-6 w-6 text-primary-foreground" />
      </Button>
    </div>
  );
};

export default Dashboard;
