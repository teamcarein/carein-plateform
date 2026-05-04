import { Topbar } from '@/components/layout/topbar'
import { Card, CardHeader, CardTitle } from '@carein/ui-kit'
import { EncounterTable } from '@/components/encounters/encounter-table'

export default function EncountersPage() {
  return (
    <div>
      <Topbar />
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Tous les dossiers</CardTitle>
          </CardHeader>
          <EncounterTable />
        </Card>
      </div>
    </div>
  )
}
