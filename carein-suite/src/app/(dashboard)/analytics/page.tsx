import { TrendingUp, Building2, Users, Stethoscope } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@carein/ui-kit'
import { MetricCard } from '@carein/ui-kit'
import { BarChart } from '@carein/ui-kit'
import { getAnalyticsOverview } from '@/features/analytics/api'

export default async function AnalyticsPage() {
  let overview = null
  try {
    overview = await getAnalyticsOverview()
  } catch { /* fallback to zeros */ }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold">Analytics</h1>
        <p className="text-sm text-foreground/50 mt-0.5">Statistiques agrégées cross-Brand Operators</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard title="Brand Operators actifs" value={overview?.total_bos           ?? '—'} icon={Building2}   colorScheme="primary"   />
        <MetricCard title="Tenants déployés"        value={overview?.total_tenants       ?? '—'} icon={Users}       colorScheme="secondary" />
        <MetricCard title="Patients suivis"         value={overview?.total_patients      ?? '—'} icon={Stethoscope} colorScheme="success"   />
        <MetricCard title="Consultations / 30j"     value={overview?.consultations_30d   ?? '—'} icon={TrendingUp}  colorScheme="warning"   />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Patients par BO</CardTitle>
          </CardHeader>
          <div className="px-2 pb-4 pt-2">
            {overview?.patients_by_bo?.length ? (
              <BarChart
                data={overview.patients_by_bo.map(b => ({ label: b.code, value: b.count }))}
                height={160}
              />
            ) : (
              <div className="py-10 text-center text-sm text-foreground/30">Aucune donnée</div>
            )}
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Consultations par mois</CardTitle>
          </CardHeader>
          <div className="px-2 pb-4 pt-2">
            {overview?.monthly_consultations?.length ? (
              <BarChart
                data={overview.monthly_consultations.map(m => ({ label: m.month, value: m.count }))}
                height={160}
                color="var(--color-success)"
              />
            ) : (
              <div className="py-10 text-center text-sm text-foreground/30">Aucune donnée</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
