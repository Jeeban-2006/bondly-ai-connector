import { useState } from 'react';
import { Sparkles, Copy, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AIMessageGeneratorProps {
  contactName: string;
  relationshipType?: string;
  importanceLevel?: number;
  lastContacted?: string;
  healthScore?: number;
  recentNotes?: string;
}

type Tone = 'Warm' | 'Funny' | 'Formal';
type Length = 'Short' | 'Medium' | 'Long';

const tones: Tone[] = ['Warm', 'Funny', 'Formal'];
const lengths: Length[] = ['Short', 'Medium', 'Long'];

const AIMessageGenerator = ({ 
  contactName,
  relationshipType,
  importanceLevel,
  lastContacted,
  healthScore,
  recentNotes,
}: AIMessageGeneratorProps) => {
  const { toast } = useToast();
  const [tone, setTone] = useState<Tone>('Warm');
  const [length, setLength] = useState<Length>('Medium');
  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setMessage('');
    setCopied(false);

    try {
      const response = await fetch('http://localhost:3000/api/ai/generate-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contactName, 
          tone, 
          length,
          relationshipType,
          importanceLevel,
          lastContacted,
          healthScore,
          recentNotes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate message');
      }

      const data = await response.json();
      
      if (!data.success || !data.message) {
        throw new Error('Invalid response from AI service');
      }

      // Typing animation effect
      const fullMessage = data.message;
      let index = 0;
      const typingSpeed = 15;

      const typeInterval = setInterval(() => {
        if (index < fullMessage.length) {
          setMessage(fullMessage.slice(0, index + 1));
          index++;
        } else {
          clearInterval(typeInterval);
          setIsGenerating(false);
        }
      }, typingSpeed);

    } catch (error) {
      setIsGenerating(false);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate message';
      
      toast({ 
        title: 'AI Generation Failed', 
        description: errorMessage,
        variant: 'destructive' 
      });
    }
  };

  const handleCopy = async () => {
    if (!message) return;
    
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Message copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="glass-card-static p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">AI Message Generator</h3>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-2 font-medium">Tone</p>
        <div className="flex gap-2">
          {tones.map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              disabled={isGenerating}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                tone === t
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
              style={tone === t ? { boxShadow: 'var(--shadow-primary)' } : undefined}
              aria-label={`Select ${t} tone`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-2 font-medium">Length</p>
        <div className="flex gap-2">
          {lengths.map((l) => (
            <button
              key={l}
              onClick={() => setLength(l)}
              disabled={isGenerating}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                length === l
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
              style={length === l ? { boxShadow: 'var(--shadow-primary)' } : undefined}
              aria-label={`Select ${l} length`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full btn-primary-glow rounded-xl text-primary-foreground border-0"
        aria-label="Generate AI message"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Message
          </>
        )}
      </Button>

      {message && (
        <div className="relative bg-primary/5 border border-primary/10 rounded-2xl p-4 animate-fade-in">
          {/* Chat bubble tail */}
          <div className="absolute -top-2 left-6 w-4 h-4 bg-primary/5 border-l border-t border-primary/10 rotate-45" />
          <p className="text-sm text-foreground leading-relaxed relative z-10 whitespace-pre-wrap">
            {message}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 text-xs text-muted-foreground hover:text-foreground rounded-lg"
            onClick={handleCopy}
            disabled={!message}
            aria-label={copied ? 'Copied' : 'Copy message'}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AIMessageGenerator;
