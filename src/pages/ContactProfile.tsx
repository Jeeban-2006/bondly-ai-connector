import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, PenLine, Phone, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HealthIndicator from '@/components/contacts/HealthIndicator';
import ContactTimeline from '@/components/contacts/ContactTimeline';
import AIMessageGenerator from '@/components/contacts/AIMessageGenerator';
import { mockContacts, getInitials, getAvatarColor } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const relationshipBadgeColors: Record<string, string> = {
  Family: 'bg-accent/10 text-accent',
  Friend: 'bg-primary/10 text-primary',
  Colleague: 'bg-warning/10 text-warning',
  Partner: 'bg-success/10 text-success',
  Acquaintance: 'bg-secondary text-muted-foreground',
};

const ContactProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const contact = mockContacts.find(c => c.id === id);

  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-6xl mb-4">🤷</p>
        <h2 className="text-xl font-semibold text-foreground">Contact not found</h2>
        <p className="text-muted-foreground mt-1">This person doesn't seem to exist in your network.</p>
        <Button onClick={() => navigate('/')} className="mt-4 rounded-xl btn-primary-glow border-0 text-primary-foreground">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3 animate-in">
        <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-5">
          {/* Profile card */}
          <div className="glass-card-static p-6 text-center space-y-4 animate-in animate-in-delay-1">
            <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto", getAvatarColor(contact.name))}>
              {getInitials(contact.name)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{contact.name}</h2>
              <span className={cn("inline-block text-xs font-medium px-3 py-1 rounded-full mt-1", relationshipBadgeColors[contact.relationshipType])}>
                {contact.relationshipType}
              </span>
            </div>
            <HealthIndicator score={contact.healthScore} status={contact.healthStatus} size="lg" />
            <p className="text-sm text-muted-foreground">Last contacted {contact.lastContacted}</p>
          </div>

          {/* Quick actions */}
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

          {/* Notes */}
          <div className="glass-card-static p-4 animate-in animate-in-delay-3">
            <h3 className="text-sm font-semibold text-foreground mb-2">Notes</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{contact.notes}</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-3 space-y-6">
          {/* Timeline */}
          <div className="animate-in animate-in-delay-2">
            <h3 className="text-lg font-semibold text-foreground mb-4">Interaction Timeline</h3>
            <ContactTimeline interactions={contact.interactions} />
          </div>

          {/* AI Message Generator */}
          <div className="animate-in animate-in-delay-3">
            <AIMessageGenerator contactName={contact.name} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactProfile;
