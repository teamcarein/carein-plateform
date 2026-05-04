import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Building2, Users, Settings, ScrollText } from 'lucide-react'
import { Card, CardHeader, CardTitle, Badge, type BadgeVariant } from '@carein/ui-kit'
import { getBrandOperator } from '@/features/brand-operators/api'
import { formatDate, countryLabel } from '@/lib/formatters'
import { requireAuth } from '@/features/auth/session'
import { apiGet } from '@/lib/api-client'
import type { ImpersonationUser } from '@/features/impersonation/types'
import { BOActions } from './bo-actions'

const TYPE_LABELS: Record<string, string> = {
  ngo: 'ONG', public: 'Public', private: 'Privé', government: 'Gouvernemental',
}

export default async function BrandOperatorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let bo
  try {
    bo = await getBrandOperator(id)
  } catch {
    notFound()
  }

  const { token } = await requireAuth()
  let users: ImpersonationUser[] = []
  try {
    const res = await apiGet<{ data: ImpersonationUser[] }>(`/carein/users?tenant=${bo.code}`, token)
    users = res.data
  } catch { /* show empty state */ }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/brand-operators" className="text-foreground/40 hover:text-foreground transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 size={20} className="text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{bo.name}</h1>
              <Badge variant={bo.status as BadgeVariant}>
                {bo.status === 'active' ? 'Actif' : bo.status === 'suspended' ? 'Suspendu' : bo.status === 'pending' ? 'En attente' : 'Archivé'}
              </Badge>
            </div>
            <p className="text-sm text-foreground/50 font-mono">{bo.code} · {countryLabel(bo.country)}</p>
          </div>
        </div>
        <BOActions uuid={bo.id} status={bo.status} />
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Code',      value: bo.code,                    mono: true },
          { label: 'Type',      value: TYPE_LABELS[bo.type] ?? bo.type       },
          { label: 'Pays',      value: countryLabel(bo.country)               },
          { label: 'Langue',    value: bo.language                            },
          { label: 'Devise',    value: bo.currency                            },
          { label: 'Timezone',  value: bo.timezone                            },
          { label: 'Activé le', value: formatDate(bo.activated_at)            },
          { label: 'Créé le',   value: formatDate(bo.created_at)              },
        ].map((item) => (
          <div key={item.label} className="bg-surface border border-border rounded-[var(--radius-card)] p-4">
            <p className="text-xs text-foreground/40 uppercase tracking-wide mb-1">{item.label}</p>
            <p className={`font-semibold text-sm ${item.mono ? 'font-mono text-primary' : ''}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Utilisateurs ({users.length})</CardTitle>
            <Users size={16} className="text-foreground/30" />
          </CardHeader>
          {users.length === 0 ? (
            <div className="py-8 text-center">
              <Users size={28} className="mx-auto text-foreground/15 mb-2" />
              <p className="text-sm text-foreground/40">Aucun utilisateur actif</p>
            </div>
          ) : (
            <div className="divide-y divide-border -mx-4">
              {users.map((u) => (
                <div key={u.uuid} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-primary uppercase">
                      {u.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{u.name}</p>
                    <p className="text-xs text-foreground/40 truncate">{u.email}</p>
                  </div>
                  {u.role && (
                    <span className="text-[10px] uppercase tracking-wide font-medium text-foreground/40 bg-foreground/5 px-2 py-0.5 rounded-full shrink-0">
                      {u.role}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="space-y-3">
          <Link href="/modules" className="block">
            <Card className="cursor-pointer hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-3">
                <Settings size={16} className="text-primary" />
                <div>
                  <p className="text-sm font-medium">Configurer les modules</p>
                  <p className="text-xs text-foreground/40">Activer / désactiver les features</p>
                </div>
              </div>
            </Card>
          </Link>
          <Link href={`/audit?tenant=${bo.code}`} className="block">
            <Card className="cursor-pointer hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-3">
                <ScrollText size={16} className="text-primary" />
                <div>
                  <p className="text-sm font-medium">Voir les audit logs</p>
                  <p className="text-xs text-foreground/40">Activité récente sur ce tenant</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
