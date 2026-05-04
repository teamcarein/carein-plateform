import { cn } from '../lib/cn'

export type BadgeVariant =
  // États génériques
  | 'default' | 'draft' | 'planned' | 'pending'
  // Succès / actif
  | 'active' | 'validated' | 'success'
  // Progression
  | 'in_progress' | 'completed' | 'consumed'
  // Avertissement
  | 'anomaly' | 'awaiting_review' | 'under_review' | 'needs_info' | 'warning'
  // Danger / erreur
  | 'critical' | 'paused' | 'cancelled' | 'expired' | 'revoked' | 'danger'
  // Suspension / archive
  | 'suspended' | 'archived'

export type BadgeProps = {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  // Neutres
  default:        'bg-foreground/8 text-foreground/60',
  draft:          'bg-foreground/8 text-foreground/60',
  planned:        'bg-foreground/8 text-foreground/60',
  archived:       'bg-foreground/8 text-foreground/40',
  // Succès
  active:         'bg-success/15 text-success',
  validated:      'bg-success/15 text-success',
  success:        'bg-success/15 text-success',
  // Progression
  in_progress:    'bg-secondary/15 text-secondary',
  completed:      'bg-secondary/15 text-secondary',
  consumed:       'bg-secondary/15 text-secondary',
  // Avertissement
  pending:        'bg-warning/15 text-warning',
  anomaly:        'bg-warning/15 text-warning',
  awaiting_review:'bg-warning/15 text-warning',
  under_review:   'bg-warning/15 text-warning',
  needs_info:     'bg-warning/15 text-warning',
  warning:        'bg-warning/15 text-warning',
  // Danger
  critical:       'bg-danger/15 text-danger',
  paused:         'bg-danger/15 text-danger',
  cancelled:      'bg-danger/15 text-danger',
  expired:        'bg-danger/15 text-danger',
  revoked:        'bg-danger/15 text-danger',
  suspended:      'bg-danger/15 text-danger',
  danger:         'bg-danger/15 text-danger',
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  const style = variants[variant] ?? variants.default
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', style, className)}>
      {children}
    </span>
  )
}
