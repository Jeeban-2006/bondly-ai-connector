import { useState } from 'react';
import { MessageCircle, PenLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import HealthIndicator from '@/components/contacts/HealthIndicator';
import InteractionDialog from '@/components/contacts/InteractionDialog';
import { getInitials, getAvatarColor } from '@/lib/utils';
import { cn } from '@/lib/utils';

export interface DashboardContact {
  id: string;
  name: string;
  relationship_type: string;
  health_score: number;
  health_status: string;
  last_contacted: string | null;
  avatar_url: string | null;
}

interface ContactCheckInCardProps {
  contact: DashboardContact;
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
  const [dialogMode, setDialogMode] = useState<'message' | 'log' | null>(null);

  return (
    <>
      <div
        className="glass-card p-4 animate-in cursor-pointer"
        style={{ animationDelay }}
        onClick={() => navigate(`/contact/${contact.id}`)}
      >
        <div className="flex items-center gap-4">
          {contact.avatar_url ? (
            <img
              src={contact.avatar_url}
              alt={contact.name}
              className="w-12 h-12 rounded-2xl object-cover shrink-0"
            />
          ) : (
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0", getAvatarColor(contact.name))}>
              {getInitials(contact.name)}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground truncate">{contact.name}</h3>
              <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full", relationshipBadgeColors[contact.relationship_type] ?? 'bg-secondary text-muted-foreground')}>
                {contact.relationship_type}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {contact.last_contacted ? `Last contacted ${contact.last_contacted}` : 'Never contacted'}
            </p>

            <div className="mt-2 w-full h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700",
                  contact.health_status === 'strong' && 'bg-success',
                  contact.health_status === 'check' && 'bg-warning',
                  contact.health_status === 'overdue' && 'bg-destructive'
                )}
                style={{ width: `${contact.health_score}%` }}
              />
            </div>
          </div>

          <HealthIndicator score={contact.health_score} status={contact.health_status as any} size="sm" />

          <div className="flex gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary"
              onClick={(e) => { e.stopPropagation(); setDialogMode('message'); }}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-accent/10 hover:text-accent"
              onClick={(e) => { e.stopPropagation(); setDialogMode('log'); }}
            >
              <PenLine className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <InteractionDialog
        contactName={contact.name}
        mode={dialogMode || 'message'}
        open={dialogMode !== null}
        onClose={() => setDialogMode(null)}
      />
    </>
  );
};

export default ContactCheckInCard;
