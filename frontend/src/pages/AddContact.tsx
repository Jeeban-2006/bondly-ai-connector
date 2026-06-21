import { useState } from 'react';
import { ArrowLeft, Check, Import } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import HealthIndicator from '@/components/contacts/HealthIndicator';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// TypeScript declaration for Contact Picker API
declare global {
  interface ContactInfo {
    name?: string[];
    email?: string[];
    tel?: string[];
  }
  interface Navigator {
    contacts?: {
      select: (
        properties: string[],
        options?: { multiple?: boolean }
      ) => Promise<ContactInfo[]>;
      getProperties: () => Promise<string[]>;
    };
  }
}

const AddContact = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [relationshipType, setRelationshipType] = useState('');
  const [importance, setImportance] = useState([3]);
  const [birthday, setBirthday] = useState<Date>();
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const isContactPickerSupported = typeof navigator !== 'undefined' && 'contacts' in navigator && 'select' in (navigator.contacts || {});

  const handleImportContact = async () => {
    if (!isContactPickerSupported) {
      toast({
        title: 'Not supported',
        description: 'Contact import is only available on supported mobile browsers (Chrome on Android).',
        variant: 'destructive',
      });
      return;
    }
    try {
      const contacts = await navigator.contacts!.select(['name', 'email', 'tel'], { multiple: false });
      if (contacts.length > 0) {
        const contact = contacts[0];
        if (contact.name?.[0]) setName(contact.name[0]);
        toast({ title: '📇 Contact imported!', description: `Imported ${contact.name?.[0] || 'contact'} from your device.` });
      }
    } catch {
      // User cancelled the picker
    }
  };

  const healthScore = Math.min(100, importance[0] * 20);
  const healthStatus = healthScore >= 70 ? 'strong' : healthScore >= 40 ? 'check' : 'overdue' as const;

  const handleSave = async () => {
    if (!name || !relationshipType) {
      toast({ title: 'Please fill in required fields', variant: 'destructive' });
      return;
    }
    setSaving(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({ title: 'Not logged in', variant: 'destructive' });
      setSaving(false);
      return;
    }

    const { error } = await supabase.from('contacts').insert({
      user_id: session.user.id,
      name,
      relationship_type: relationshipType,
      importance: importance[0],
      birthday: birthday ? format(birthday, 'yyyy-MM-dd') : null,
      notes,
      health_score: healthScore,
      health_status: healthStatus,
    });

    if (error) {
      toast({ title: 'Error saving contact', description: error.message, variant: 'destructive' });
      setSaving(false);
      return;
    }

    setSaved(true);
    toast({ title: '✨ Contact saved!', description: `${name} has been added to your connections.` });
    setTimeout(() => navigate('/contacts'), 1200);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between animate-in">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => navigate('/contacts')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Add Contact</h1>
            <p className="text-sm text-muted-foreground">Nurture a new connection</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl gap-2 border-primary/30 text-primary hover:bg-primary/10"
          onClick={handleImportContact}
        >
          <Import className="h-4 w-4" />
          <span className="hidden sm:inline">Import</span>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Form */}
        <div className="md:col-span-2 space-y-5 animate-in animate-in-delay-1">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Name *</label>
            <Input
              placeholder="Enter name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl h-11 bg-card border-border"
            />
          </div>

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

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Birthday</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal rounded-xl h-11 bg-card border-border", !birthday && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthday ? format(birthday, "PPP") : "Pick a date"}
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
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Notes</label>
            <Textarea
              placeholder="What makes this person special?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-xl bg-card border-border min-h-[100px]"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={saving || saved}
            className={cn(
              "w-full h-12 rounded-xl text-primary-foreground border-0 font-semibold",
              saved ? "bg-success" : "btn-primary-glow"
            )}
          >
            {saved ? <><Check className="h-5 w-5 mr-2" /> Saved!</> : saving ? 'Saving...' : 'Save Contact'}
          </Button>
        </div>

        {/* Preview */}
        <div className="animate-in animate-in-delay-2">
          <div className="glass-card-static p-5 text-center space-y-4 sticky top-24">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Health Preview</p>
            <HealthIndicator score={healthScore} status={healthStatus} size="lg" />
            <div>
              <p className="font-semibold text-foreground">{name || 'New Contact'}</p>
              <p className="text-sm text-muted-foreground">{relationshipType || 'No type selected'}</p>
            </div>
            <p className="text-xs text-muted-foreground italic">Relationships grow when nurtured 🌱</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContact;
