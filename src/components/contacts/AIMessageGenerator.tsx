import { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AIMessageGeneratorProps {
  contactName: string;
}

const tones = ['Warm', 'Funny', 'Formal'] as const;
const lengths = ['Short', 'Medium', 'Long'] as const;

const sampleMessages: Record<string, Record<string, string>> = {
  Warm: {
    Short: "Hey! Just wanted to check in and say I'm thinking of you. Hope you're doing well! 💛",
    Medium: "Hey! It's been a little while and I just wanted to reach out. I hope everything's going great on your end. Let's catch up soon — I'd love to hear what you've been up to!",
    Long: "Hi there! I was just thinking about you and realized it's been a while since we last connected. I hope life is treating you well! I'd really love to catch up sometime soon — maybe grab a coffee or hop on a call? You're one of those people who always brightens my day, and I don't want to let too much time pass without telling you that. 💛",
  },
  Funny: {
    Short: "Did you forget about me? Because I definitely haven't forgotten about you 😄",
    Medium: "Okay, I just checked and it's been way too long since we talked. I'm starting to think you've replaced me with someone cooler. Impossible, I know 😎 Let's catch up!",
    Long: "Alright, I'm filing a formal complaint. It's been forever since we hung out and my social calendar is looking sad. I've been telling people about our adventures and they think I made you up. Help me prove them wrong — let's do something soon! 😂",
  },
  Formal: {
    Short: "I hope this message finds you well. I'd love to reconnect at your convenience.",
    Medium: "I hope you're doing well. It's been some time since we last connected, and I wanted to reach out to see how things are going. I'd appreciate the opportunity to catch up whenever you're available.",
    Long: "I hope this message finds you in good spirits. It has been a while since our last interaction, and I wanted to take a moment to reach out. I value our relationship and would very much like to schedule some time to reconnect. Please let me know if you have any availability in the coming weeks — I'd be happy to work around your schedule.",
  },
};

const AIMessageGenerator = ({ contactName }: AIMessageGeneratorProps) => {
  const [tone, setTone] = useState<typeof tones[number]>('Warm');
  const [length, setLength] = useState<typeof lengths[number]>('Medium');
  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setMessage('');

    // Simulate AI generation with typing effect
    const fullMessage = sampleMessages[tone][length].replace('there', contactName);
    let index = 0;

    const interval = setInterval(() => {
      setMessage(fullMessage.slice(0, index + 1));
      index++;
      if (index >= fullMessage.length) {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 15);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                tone === t
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
              style={tone === t ? { boxShadow: 'var(--shadow-primary)' } : undefined}
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
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                length === l
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
              style={length === l ? { boxShadow: 'var(--shadow-primary)' } : undefined}
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
      >
        <Sparkles className="h-4 w-4 mr-2" />
        {isGenerating ? 'Generating...' : 'Generate Message'}
      </Button>

      {message && (
        <div className="relative bg-primary/5 border border-primary/10 rounded-2xl p-4 animate-fade-in">
          {/* Chat bubble tail */}
          <div className="absolute -top-2 left-6 w-4 h-4 bg-primary/5 border-l border-t border-primary/10 rotate-45" />
          <p className="text-sm text-foreground leading-relaxed relative z-10">{message}</p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 text-xs text-muted-foreground hover:text-foreground rounded-lg"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AIMessageGenerator;
