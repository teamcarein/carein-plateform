interface BarChartItem {
  label: string
  value: number
}

interface BarChartProps {
  data: BarChartItem[]
  height?: number
  color?: string
  formatValue?: (v: number) => string
}

export function BarChart({
  data,
  height = 160,
  color = 'var(--color-primary)',
  formatValue = (v) => String(v),
}: BarChartProps) {
  if (!data.length) return null

  const max     = Math.max(...data.map(d => d.value), 1)
  const barW    = 100 / data.length
  const padding = barW * 0.25

  return (
    <div className="w-full" style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full" style={{ height }}>
        {data.map((item, i) => {
          const barHeight = (item.value / max) * 78
          const x         = i * barW + padding / 2
          const w         = barW - padding
          const y         = 85 - barHeight

          return (
            <g key={i}>
              <rect x={x} y={y} width={w} height={barHeight} fill={color} opacity="0.85" rx="1" />
              {barHeight > 8 && (
                <text x={x + w / 2} y={y - 1} textAnchor="middle" fontSize="4" fill="currentColor" className="text-foreground/50">
                  {formatValue(item.value)}
                </text>
              )}
              <text x={x + w / 2} y={93} textAnchor="middle" fontSize="3.5" fill="currentColor" className="text-foreground/40">
                {item.label.length > 7 ? item.label.slice(0, 6) + '…' : item.label}
              </text>
            </g>
          )
        })}
        <line x1="0" y1="86" x2="100" y2="86" stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.5" />
      </svg>
    </div>
  )
}
