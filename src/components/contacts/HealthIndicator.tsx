import { cn } from '@/lib/utils';
import { HealthStatus } from '@/lib/mockData';

interface HealthIndicatorProps {
  score: number;
  status: HealthStatus;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { container: 'w-10 h-10', text: 'text-xs', stroke: 3, radius: 16 },
  md: { container: 'w-16 h-16', text: 'text-sm font-semibold', stroke: 4, radius: 26 },
  lg: { container: 'w-28 h-28', text: 'text-2xl font-bold', stroke: 5, radius: 48 },
};

const statusColors: Record<HealthStatus, string> = {
  strong: 'stroke-success',
  check: 'stroke-warning',
  overdue: 'stroke-destructive',
};

const statusBg: Record<HealthStatus, string> = {
  strong: 'text-success',
  check: 'text-warning',
  overdue: 'text-destructive',
};

const HealthIndicator = ({ score, status, size = 'md' }: HealthIndicatorProps) => {
  const config = sizeMap[size];
  const circumference = 2 * Math.PI * config.radius;
  const offset = circumference - (score / 100) * circumference;
  const svgSize = size === 'lg' ? 112 : size === 'md' ? 64 : 40;

  return (
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
          className={cn(statusColors[status], "transition-all duration-700 ease-out")}
          strokeWidth={config.stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className={cn("absolute", config.text, statusBg[status])}>
        {score}
      </span>
    </div>
  );
};

export default HealthIndicator;
