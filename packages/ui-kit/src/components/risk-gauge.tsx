'use client'

import { cn } from '../lib/cn'

export type RiskGaugeProps = {
  score: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function getRiskConfig(score: number): { label: string; color: string } {
  if (score < 25) return { label: 'Faible',   color: 'var(--color-success)' }
  if (score < 50) return { label: 'Modéré',   color: 'var(--color-warning)' }
  if (score < 75) return { label: 'Élevé',    color: 'var(--color-warning)' }
  return              { label: 'Critique', color: 'var(--color-danger)'  }
}

const sizes = {
  sm: { r: 28, stroke: 4, text: 'text-lg' },
  md: { r: 40, stroke: 5, text: 'text-2xl' },
  lg: { r: 56, stroke: 6, text: 'text-3xl' },
}

export function RiskGauge({ score, size = 'md', className }: RiskGaugeProps) {
  const { r, stroke, text } = sizes[size]
  const normalized  = Math.min(100, Math.max(0, score))
  const { label, color } = getRiskConfig(normalized)
  const cx          = r + stroke
  const cy          = r + stroke
  const dim         = (r + stroke) * 2
  const circumference = 2 * Math.PI * r
  const offset      = circumference - (normalized / 100) * circumference

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeOpacity={0.1} strokeWidth={stroke} />
          <circle
            cx={cx} cy={cy} r={r} fill="none"
            stroke={color} strokeWidth={stroke}
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <span className={cn('absolute inset-0 flex items-center justify-center font-bold font-mono', text)} style={{ color }}>
          {normalized}
        </span>
      </div>
      <span className="text-xs font-semibold" style={{ color }}>{label}</span>
    </div>
  )
}
