import { useState } from 'react';
import { MessageCircle, Phone, Users, Gift, StickyNote, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface InteractionDialogProps {
  contactId: string;
  contactName: string;
  mode: 'message' | 'log';
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const interactionTypes = [
  { value: 'call', label: 'Phone Call', icon: Phone },
  { value: 'message', label: 'Message', icon: MessageCircle },
  { value: 'meeting', label: 'Meeting', icon: Users },
  { value: 'gift', label: 'Gift', icon: Gift },
  { value: 'note', label: 'Note', icon: StickyNote },
];

import { supabase } from '@/integrations/supabase/client';
import { calculateHealthScore } from '@/utils/healthEngine';

const InteractionDialog = ({ contactId, contactName, mode, open, onClose, onSuccess }: InteractionDialogProps) => {
  const [type, setType] = useState('message');
  const [content, setContent] = useState('');

  if (!open) return null;

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({ title: 'Please enter some details', variant: 'destructive' });
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('interactions').insert({
        contact_id: contactId,
        user_id: user.id,
        type: mode === 'message' ? 'message' : type,
        description: content,
        date: new Date().toISOString().split('T')[0]
      });

      if (error) throw error;

      // Recalculate and update health score
      const { data: contact } = await supabase.from('contacts').select('*').eq('id', contactId).single();
      const { count } = await supabase.from('interactions').select('*', { count: 'exact', head: true }).eq('contact_id', contactId);
      
      const newScore = calculateHealthScore(
        new Date().toISOString(),
        contact?.importance_level || 3,
        (count || 0), // count already includes the one we just inserted
        contact?.health_score
      );

      await supabase.from('contacts').update({
        last_contacted: new Date().toISOString(),
        health_score: newScore.score,
        health_status: newScore.status
      }).eq('id', contactId);

      toast({
        title: mode === 'message' ? '💬 Message recorded!' : '📝 Interaction logged!',
        description: `Logged for ${contactName}`,
      });
      setContent('');
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({ title: 'Failed to log interaction', description: (error as Error).message, variant: 'destructive' });
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="glass-card-static w-full max-w-md p-6 space-y-4 animate-in">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              {mode === 'message' ? `Send Message to ${contactName}` : `Log Interaction with ${contactName}`}
            </h2>
            <Button variant="ghost" size="icon" className="rounded-xl" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {mode === 'log' && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Type</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="rounded-xl h-11 bg-card border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {interactionTypes.map(t => (
                    <SelectItem key={t.value} value={t.value}>
                      <span className="flex items-center gap-2">
                        <t.icon className="h-4 w-4" /> {t.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              {mode === 'message' ? 'Your message' : 'What happened?'}
            </label>
            <Textarea
              placeholder={mode === 'message' ? 'Write your message...' : 'Describe the interaction...'}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="rounded-xl bg-card border-border min-h-[100px]"
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 rounded-xl border-border" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 rounded-xl btn-primary-glow text-primary-foreground border-0"
            >
              {mode === 'message' ? 'Send' : 'Log'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InteractionDialog;
