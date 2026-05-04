'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
type AnomalyEntry = { type: string; count: number; percentage: number }

type AnomalyChartProps = {
  data: AnomalyEntry[]
}

const COLORS = [
  'var(--color-danger)',
  'var(--color-warning)',
  'var(--color-secondary)',
  'var(--color-primary)',
  'var(--color-extra)',
]

export function AnomalyChart({ data }: AnomalyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
        <XAxis dataKey="type" tick={{ fontSize: 11, fill: 'rgba(0,0,0,0.4)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: 'rgba(0,0,0,0.4)' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Bar dataKey="count" name="Anomalies" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
