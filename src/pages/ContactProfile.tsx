import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, PenLine, Phone, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HealthIndicator from '@/components/contacts/HealthIndicator';
import ContactTimeline from '@/components/contacts/ContactTimeline';
import AIMessageGenerator from '@/components/contacts/AIMessageGenerator';
import { getInitials, getAvatarColor } from '@/lib/mockData';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

const relationshipBadgeColors: Record<string, string> = {
  Family: 'bg-accent/10 text-accent',
  Friend: 'bg-primary/10 text-primary',
  Colleague: 'bg-warning/10 text-warning',
  Partner: 'bg-success/10 text-success',
  Acquaintance: 'bg-secondary text-muted-foreground',
};

interface Contact {
  id: string;
  name: string;
  relationship_type: string;
  importance: number;
  health_score: number;
  health_status: string;
  last_contacted: string | null;
  birthday: string | null;
  notes: string | null;
  avatar_url: string | null;
}

interface Interaction {
  id: string;
  type: string;
  description: string;
  date: string;
}

const ContactProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState<Contact | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [contactRes, interactionsRes] = await Promise.all([
        supabase.from('contacts').select('*').eq('id', id!).maybeSingle(),
        supabase.from('interactions').select('id, type, description, date').eq('contact_id', id!).order('date', { ascending: false }),
      ]);
      setContact(contactRes.data ?? null);
      setInteractions(interactionsRes.data ?? []);
      setLoading(false);
    };
    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 rounded-xl btn-primary-glow flex items-center justify-center animate-pulse">
          <span className="text-primary-foreground text-lg">💛</span>
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-6xl mb-4">🤷</p>
        <h2 className="text-xl font-semibold text-foreground">Contact not found</h2>
        <p className="text-muted-foreground mt-1">This person doesn't seem to exist in your network.</p>
        <Button onClick={() => navigate('/contacts')} className="mt-4 rounded-xl btn-primary-glow border-0 text-primary-foreground">
          Back to Contacts
        </Button>
      </div>
    );
  }

  // Map DB interactions to the shape ContactTimeline expects
  const timelineInteractions = interactions.map(i => ({
    id: i.id,
    type: i.type,
    date: i.date,
    description: i.description,
  }));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3 animate-in">
        <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => navigate('/contacts')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-5">
          <div className="glass-card-static p-6 text-center space-y-4 animate-in animate-in-delay-1">
            {contact.avatar_url ? (
              <img src={contact.avatar_url} alt={contact.name} className="w-20 h-20 rounded-3xl object-cover mx-auto" />
            ) : (
              <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto", getAvatarColor(contact.name))}>
                {getInitials(contact.name)}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-foreground">{contact.name}</h2>
              <span className={cn("inline-block text-xs font-medium px-3 py-1 rounded-full mt-1", relationshipBadgeColors[contact.relationship_type] ?? 'bg-secondary text-muted-foreground')}>
                {contact.relationship_type}
              </span>
            </div>
            <HealthIndicator score={contact.health_score} status={contact.health_status as any} size="lg" />
            <p className="text-sm text-muted-foreground">
              {contact.last_contacted ? `Last contacted ${contact.last_contacted}` : 'Never contacted'}
            </p>
          </div>

          <div className="glass-card-static p-4 space-y-2 animate-in animate-in-delay-2">
            <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
            {[
              { icon: MessageCircle, label: 'Send Message', color: 'hover:bg-primary/10 hover:text-primary' },
              { icon: Phone, label: 'Log Call', color: 'hover:bg-success/10 hover:text-success' },
              { icon: PenLine, label: 'Add Note', color: 'hover:bg-warning/10 hover:text-warning' },
              { icon: Heart, label: 'Set Reminder', color: 'hover:bg-accent/10 hover:text-accent' },
            ].map((action) => (
              <button
                key={action.label}
                className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground transition-all duration-200", action.color)}
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </button>
            ))}
          </div>

          {contact.notes && (
            <div className="glass-card-static p-4 animate-in animate-in-delay-3">
              <h3 className="text-sm font-semibold text-foreground mb-2">Notes</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{contact.notes}</p>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="md:col-span-3 space-y-6">
          <div className="animate-in animate-in-delay-2">
            <h3 className="text-lg font-semibold text-foreground mb-4">Interaction Timeline</h3>
            {timelineInteractions.length > 0 ? (
              <ContactTimeline interactions={timelineInteractions} />
            ) : (
              <div className="glass-card-static p-8 text-center text-muted-foreground">
                <p className="text-3xl mb-2">📭</p>
                <p className="text-sm">No interactions logged yet.</p>
              </div>
            )}
          </div>

          <div className="animate-in animate-in-delay-3">
            <AIMessageGenerator contactName={contact.name} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactProfile;
