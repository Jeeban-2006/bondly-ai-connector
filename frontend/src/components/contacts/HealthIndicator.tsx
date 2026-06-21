import { cn } from '@/lib/utils';
import { HealthStatus } from '@/utils/healthEngine';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface HealthIndicatorProps {
  score: number;
  status: HealthStatus | string;
  size?: 'sm' | 'md' | 'lg';
  trend?: 'up' | 'down' | 'flat';
  showLabel?: boolean;
}

const sizeMap = {
  sm: { container: 'w-10 h-10', text: 'text-xs', stroke: 3, radius: 16 },
  md: { container: 'w-16 h-16', text: 'text-sm font-semibold', stroke: 4, radius: 26 },
  lg: { container: 'w-28 h-28', text: 'text-2xl font-bold', stroke: 5, radius: 48 },
};

const statusColors: Record<string, string> = {
  thriving: 'stroke-emerald-500',
  healthy: 'stroke-blue-500',
  needs_attention: 'stroke-amber-500',
  at_risk: 'stroke-rose-500',
  strong: 'stroke-emerald-500', // legacy support
  check: 'stroke-amber-500', // legacy support
  overdue: 'stroke-rose-500', // legacy support
};

const statusBg: Record<string, string> = {
  thriving: 'text-emerald-500',
  healthy: 'text-blue-500',
  needs_attention: 'text-amber-500',
  at_risk: 'text-rose-500',
  strong: 'text-emerald-500',
  check: 'text-amber-500',
  overdue: 'text-rose-500',
};

const statusLabels: Record<string, string> = {
  thriving: 'Thriving',
  healthy: 'Healthy',
  needs_attention: 'Needs Attention',
  at_risk: 'At Risk',
  strong: 'Thriving',
  check: 'Needs Attention',
  overdue: 'At Risk',
};

const HealthIndicator = ({ score, status, size = 'md', trend, showLabel }: HealthIndicatorProps) => {
  const config = sizeMap[size];
  const circumference = 2 * Math.PI * config.radius;
  const offset = circumference - (score / 100) * circumference;
  const svgSize = size === 'lg' ? 112 : size === 'md' ? 64 : 40;
  
  const isAtRisk = status === 'at_risk' || status === 'overdue' || score < 40;

  return (
    <div className="flex items-center gap-3 group relative">
      <div className={cn("relative inline-flex items-center justify-center", config.container)}>
        <svg
          width={svgSize}
          height={svgSize}
          className="-rotate-90"
        >
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={config.radius}
            fill="none"
            className="stroke-secondary"
            strokeWidth={config.stroke}
          />
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={config.radius}
            fill="none"
            className={cn(
              statusColors[status] || statusColors['healthy'], 
              "transition-all duration-1000 ease-out",
              isAtRisk ? "animate-pulse" : ""
            )}
            strokeWidth={config.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <span className={cn("absolute", config.text, statusBg[status] || statusBg['healthy'])}>
          {score}
        </span>
      </div>

      {showLabel && (
        <div className="flex flex-col">
          <span className={cn("font-medium text-sm", statusBg[status] || statusBg['healthy'])}>
            {statusLabels[status] || 'Healthy'}
          </span>
          {trend && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              {trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-500" />}
              {trend === 'down' && <TrendingDown className="w-3 h-3 text-rose-500" />}
              {trend === 'flat' && <Minus className="w-3 h-3" />}
              <span className="capitalize">{trend}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HealthIndicator;
