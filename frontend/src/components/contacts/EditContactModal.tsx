import { useState, useEffect } from 'react';
import { X, Check, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

interface EditContactModalProps {
  contact: {
    id: string;
    name: string;
    relationship_type: string;
    importance: number;
    notes: string | null;
    birthday: string | null;
  };
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EditContactModal = ({ contact, open, onClose, onSuccess }: EditContactModalProps) => {
  const [name, setName] = useState(contact.name);
  const [relationshipType, setRelationshipType] = useState(contact.relationship_type);
  const [importance, setImportance] = useState([contact.importance]);
  const [notes, setNotes] = useState(contact.notes ?? '');
  const [birthday, setBirthday] = useState<Date | undefined>(
    contact.birthday ? parseISO(contact.birthday) : undefined
  );
  const [saving, setSaving] = useState(false);

  // Sync if contact prop changes (e.g. re-open with fresh data)
  useEffect(() => {
    setName(contact.name);
    setRelationshipType(contact.relationship_type);
    setImportance([contact.importance]);
    setNotes(contact.notes ?? '');
    setBirthday(contact.birthday ? parseISO(contact.birthday) : undefined);
  }, [contact]);

  if (!open) return null;

  const handleSave = async () => {
    if (!name.trim() || !relationshipType) {
      toast({ title: 'Please fill in required fields', variant: 'destructive' });
      return;
    }
    setSaving(true);

    const healthScore = Math.min(100, importance[0] * 20);
    const healthStatus = healthScore >= 70 ? 'strong' : healthScore >= 40 ? 'check' : 'overdue';

    const { error } = await supabase
      .from('contacts')
      .update({
        name: name.trim(),
        relationship_type: relationshipType,
        importance: importance[0],
        notes: notes.trim() || null,
        birthday: birthday ? format(birthday, 'yyyy-MM-dd') : null,
        health_score: healthScore,
        health_status: healthStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', contact.id);

    setSaving(false);

    if (error) {
      toast({ title: 'Error updating contact', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: '✅ Contact updated!', description: `${name} has been saved.` });
    onSuccess();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="glass-card-static w-full max-w-lg p-6 space-y-5 animate-in max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Edit Contact</h2>
            <Button variant="ghost" size="icon" className="rounded-xl" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Name *</label>
            <Input
              placeholder="Enter name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl h-11 bg-card border-border"
            />
          </div>

          {/* Relationship Type */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Relationship Type *</label>
            <Select value={relationshipType} onValueChange={setRelationshipType}>
              <SelectTrigger className="rounded-xl h-11 bg-card border-border">
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {['Family', 'Friend', 'Colleague', 'Partner', 'Acquaintance'].map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Importance */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Importance: <span className="text-primary font-bold">{importance[0]}/5</span>
            </label>
            <Slider
              value={importance}
              onValueChange={setImportance}
              min={1} max={5} step={1}
              className="py-2"
            />
          </div>

          {/* Birthday */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Birthday</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn('w-full justify-start text-left font-normal rounded-xl h-11 bg-card border-border', !birthday && 'text-muted-foreground')}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthday ? format(birthday, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                <Calendar
                  mode="single"
                  selected={birthday}
                  onSelect={setBirthday}
                  initialFocus
                  className="p-3 pointer-events-auto rounded-xl"
                />
              </PopoverContent>
            </Popover>
            {birthday && (
              <button
                type="button"
                onClick={() => setBirthday(undefined)}
                className="text-xs text-muted-foreground hover:text-destructive mt-1 transition-colors"
              >
                Clear birthday
              </button>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Notes</label>
            <Textarea
              placeholder="What makes this person special?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-xl bg-card border-border min-h-[80px]"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              variant="outline"
              className="flex-1 rounded-xl border-border"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 rounded-xl btn-primary-glow border-0 text-primary-foreground font-semibold"
            >
              {saving ? 'Saving...' : (
                <>
                  <Check className="h-4 w-4 mr-1.5" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditContactModal;
