import { MessageCircle, PenLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import HealthIndicator from '@/components/contacts/HealthIndicator';
import { Contact, getInitials, getAvatarColor } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface ContactCheckInCardProps {
  contact: Contact;
  animationDelay?: string;
}

const relationshipBadgeColors: Record<string, string> = {
  Family: 'bg-accent/10 text-accent',
  Friend: 'bg-primary/10 text-primary',
  Colleague: 'bg-warning/10 text-warning',
  Partner: 'bg-success/10 text-success',
  Acquaintance: 'bg-secondary text-muted-foreground',
};

const ContactCheckInCard = ({ contact, animationDelay }: ContactCheckInCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="glass-card p-4 animate-in cursor-pointer"
      style={{ animationDelay }}
      onClick={() => navigate(`/contact/${contact.id}`)}
    >
      <div className="flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0", getAvatarColor(contact.name))}>
          {getInitials(contact.name)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-foreground truncate">{contact.name}</h3>
            <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full", relationshipBadgeColors[contact.relationshipType])}>
              {contact.relationshipType}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Last contacted {contact.lastContacted}
          </p>

          {/* Health bar */}
          <div className="mt-2 w-full h-1.5 rounded-full bg-secondary overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700",
                contact.healthStatus === 'strong' && 'bg-success',
                contact.healthStatus === 'check' && 'bg-warning',
                contact.healthStatus === 'overdue' && 'bg-destructive'
              )}
              style={{ width: `${contact.healthScore}%` }}
            />
          </div>
        </div>

        <HealthIndicator score={contact.healthScore} status={contact.healthStatus} size="sm" />

        <div className="flex gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary"
            onClick={(e) => { e.stopPropagation(); }}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl hover:bg-accent/10 hover:text-accent"
            onClick={(e) => { e.stopPropagation(); }}
          >
            <PenLine className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactCheckInCard;
