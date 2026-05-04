import { cn } from '../lib/cn'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded bg-foreground/8', className)} />
}

export function SkeletonCard() {
  return (
    <div className="bg-surface border border-border rounded-[var(--radius-card,8px)] p-4 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  )
}
