import { useState } from 'react';
import { ArrowLeft, Check, Upload } from 'lucide-react';
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

const AddContact = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [relationshipType, setRelationshipType] = useState('');
  const [importance, setImportance] = useState([3]);
  const [birthday, setBirthday] = useState<Date>();
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  // Simulated health based on importance
  const healthScore = Math.min(100, importance[0] * 20);
  const healthStatus = healthScore >= 70 ? 'strong' : healthScore >= 40 ? 'check' : 'overdue' as const;

  const handleSave = () => {
    if (!name || !relationshipType) {
      toast({ title: 'Please fill in required fields', variant: 'destructive' });
      return;
    }
    setSaved(true);
    toast({ title: '✨ Contact saved!', description: `${name} has been added to your connections.` });
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 animate-in">
        <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add Contact</h1>
          <p className="text-sm text-muted-foreground">Nurture a new connection</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Form */}
        <div className="md:col-span-2 space-y-5 animate-in animate-in-delay-1">
          {/* Avatar upload */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-3xl bg-secondary border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-muted transition-colors">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>

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
              min={1}
              max={5}
              step={1}
              className="py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Birthday</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-xl h-11 bg-card border-border",
                    !birthday && "text-muted-foreground"
                  )}
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
            disabled={saved}
            className={cn(
              "w-full h-12 rounded-xl text-primary-foreground border-0 font-semibold",
              saved ? "bg-success" : "btn-primary-glow"
            )}
          >
            {saved ? (
              <><Check className="h-5 w-5 mr-2" /> Saved!</>
            ) : (
              'Save Contact'
            )}
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
            <p className="text-xs text-muted-foreground italic">
              Relationships grow when nurtured 🌱
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContact;
