import { LucideIcon } from 'lucide-react'
import { Card } from './card'
import { cn } from '../lib/cn'

export type ColorScheme = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'extra'

const schemeClasses: Record<ColorScheme, { bg: string; text: string }> = {
  primary:   { bg: 'bg-primary/10',   text: 'text-primary'   },
  secondary: { bg: 'bg-secondary/10', text: 'text-secondary' },
  success:   { bg: 'bg-success/10',   text: 'text-success'   },
  warning:   { bg: 'bg-warning/10',   text: 'text-warning'   },
  danger:    { bg: 'bg-danger/10',    text: 'text-danger'    },
  extra:     { bg: 'bg-extra/10',     text: 'text-extra'     },
}

export type MetricCardProps = {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  colorScheme?: ColorScheme
  trend?: { value: number; label: string }
  className?: string
}

export function MetricCard({ title, value, subtitle, icon: Icon, colorScheme = 'primary', trend, className }: MetricCardProps) {
  const { bg, text } = schemeClasses[colorScheme]
  return (
    <Card className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-foreground/50">{title}</span>
        <span className={cn('w-8 h-8 rounded-[var(--radius-btn,6px)] flex items-center justify-center', bg, text)}>
          <Icon size={16} />
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold font-mono tracking-tight">{value}</p>
        {subtitle && <p className="text-xs text-foreground/50 mt-0.5">{subtitle}</p>}
      </div>
      {trend && (
        <p className={cn('text-xs font-medium', trend.value >= 0 ? 'text-success' : 'text-danger')}>
          {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
        </p>
      )}
    </Card>
  )
}
