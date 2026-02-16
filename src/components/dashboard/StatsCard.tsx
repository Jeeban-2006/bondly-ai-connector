import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning';
  animationDelay?: string;
}

const variantStyles: Record<string, string> = {
  default: '',
  primary: 'border-l-4 border-l-primary',
  accent: 'border-l-4 border-l-accent',
  success: 'border-l-4 border-l-success',
  warning: 'border-l-4 border-l-warning',
};

const iconVariantStyles: Record<string, string> = {
  default: 'bg-secondary text-foreground',
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
};

const StatsCard = ({ icon: Icon, label, value, trend, variant = 'default', animationDelay }: StatsCardProps) => {
  return (
    <div
      className={cn("glass-card p-5 animate-in", variantStyles[variant])}
      style={{ animationDelay }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
          {trend && (
            <p className="text-xs text-success font-medium mt-1">{trend}</p>
          )}
        </div>
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", iconVariantStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
