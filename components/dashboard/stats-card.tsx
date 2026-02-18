import { cn } from '@/lib/utils';

interface StatsCardProps {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}

export function StatsCard({
  label,
  value,
  change,
  trend = 'neutral',
  icon,
  className,
}: StatsCardProps) {
  return (
    <div className={cn(
      'p-6 rounded-lg border border-border bg-card hover:bg-card/50 transition-colors',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {change !== undefined && (
            <p className={cn(
              'text-xs mt-2 font-medium',
              trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
            )}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {Math.abs(change)}% from last period
            </p>
          )}
        </div>
        {icon && (
          <div className="ml-4 flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
