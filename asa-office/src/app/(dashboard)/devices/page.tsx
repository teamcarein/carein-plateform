import { Topbar } from '@/components/layout/topbar'
import { Card, CardHeader, CardTitle } from '@carein/ui-kit'
import { DeviceTable } from '@/components/devices/device-table'

export default function DevicesPage() {
  return (
    <div>
      <Topbar />
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Parc d'appareils</CardTitle>
          </CardHeader>
          <DeviceTable />
        </Card>
      </div>
    </div>
  )
}
