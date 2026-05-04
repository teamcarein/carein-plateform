import { Users } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@carein/ui-kit'
import { Badge, type BadgeVariant } from '@carein/ui-kit'
import { getTeamMembers } from '@/features/team/api'
import { formatDateTime } from '@/lib/formatters'
import { TeamActions } from './team-actions'

export default async function CareInTeamPage() {
  const members = await getTeamMembers()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">Équipe CareIN</h1>
          <p className="text-sm text-foreground/50 mt-0.5">Gestion des comptes internes CareIN</p>
        </div>
        <TeamActions />
      </div>

      <Card className="p-0 overflow-hidden">
        <CardHeader className="px-4 pt-4 pb-0">
          <CardTitle>Membres actifs</CardTitle>
        </CardHeader>
        {members.length === 0 ? (
          <div className="py-10 text-center">
            <Users size={26} className="mx-auto text-foreground/15 mb-2" />
            <p className="text-sm text-foreground/40">Aucun membre</p>
          </div>
        ) : (
          <div className="divide-y divide-border mt-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">
                      {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-foreground/40">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-right">
                  {member.last_login_at && (
                    <span className="text-xs text-foreground/30 hidden xl:block">
                      Connexion {formatDateTime(member.last_login_at)}
                    </span>
                  )}
                  <span className="text-xs text-foreground/50 font-mono">{member.role}</span>
                  <Badge variant={member.status as BadgeVariant}>
                    {member.status === 'active' ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="px-4 py-3 border-t border-border flex items-center gap-2 text-xs text-foreground/40">
          <Users size={12} />
          {members.length} membre{members.length > 1 ? 's' : ''}
        </div>
      </Card>
    </div>
  )
}
