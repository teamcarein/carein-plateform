'use client'

import { Users, UserCheck, ShieldCheck, Stethoscope, Shield } from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { Card, CardHeader, CardTitle } from '@carein/ui-kit'
import { MetricCard } from '@carein/ui-kit'
import { UserTable } from '@/components/users/user-table'
import { useUsers } from '@/features/users/hooks'
import { ApiError } from '@/lib/api-client'

export default function UsersPage() {
  const { data: allData,    error: allError    } = useUsers({ per_page: 1 })
  const { data: activeData  }                    = useUsers({ is_active: true, per_page: 1 })
  const { data: adminData   }                    = useUsers({ role: 'admin', per_page: 1 })
  const { data: nurseData   }                    = useUsers({ role: 'nurse', per_page: 1 })

  if (allError instanceof ApiError && allError.status === 403) {
    return (
      <div>
        <Topbar />
        <div className="p-6 flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-full bg-foreground/8 flex items-center justify-center mb-4">
            <Shield size={26} className="text-foreground/30" />
          </div>
          <h2 className="text-base font-semibold mb-1">Accès refusé</h2>
          <p className="text-sm text-foreground/50 max-w-xs">
            La gestion des utilisateurs est réservée aux super-administrateurs.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Topbar />
      <div className="p-6 space-y-6">

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCard
            title="Utilisateurs"
            value={allData?.meta.total ?? '—'}
            icon={Users}
            colorScheme="primary"
          />
          <MetricCard
            title="Comptes actifs"
            value={activeData?.meta.total ?? '—'}
            icon={UserCheck}
            colorScheme="secondary"
          />
          <MetricCard
            title="Administrateurs"
            value={adminData?.meta.total ?? '—'}
            icon={ShieldCheck}
            colorScheme="warning"
          />
          <MetricCard
            title="Infirmier(e)s"
            value={nurseData?.meta.total ?? '—'}
            icon={Stethoscope}
            colorScheme="extra"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs</CardTitle>
          </CardHeader>
          <UserTable />
        </Card>

      </div>
    </div>
  )
}
