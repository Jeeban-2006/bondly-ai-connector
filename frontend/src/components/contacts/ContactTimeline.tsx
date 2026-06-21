import { Phone, MessageCircle, Users, Gift, StickyNote } from 'lucide-react';
import { cn } from '@/lib/utils';

const typeConfig: Record<string, { icon: typeof Phone; color: string }> = {
  call: { icon: Phone, color: 'bg-primary/10 text-primary' },
  message: { icon: MessageCircle, color: 'bg-success/10 text-success' },
  meeting: { icon: Users, color: 'bg-warning/10 text-warning' },
  gift: { icon: Gift, color: 'bg-accent/10 text-accent' },
  note: { icon: StickyNote, color: 'bg-secondary text-muted-foreground' },
};

interface TimelineInteraction {
  id: string;
  type: string;
  date: string;
  description: string;
}

interface ContactTimelineProps {
  interactions: TimelineInteraction[];
}

const ContactTimeline = ({ interactions }: ContactTimelineProps) => {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

      <div className="space-y-4">
        {interactions.map((interaction, i) => {
          const config = typeConfig[interaction.type];
          const Icon = config.icon;
          return (
            <div key={interaction.id} className="flex gap-4 items-start animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 z-10", config.color)}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="glass-card-static p-3 flex-1">
                <p className="text-sm font-medium text-foreground">{interaction.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(interaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContactTimeline;
