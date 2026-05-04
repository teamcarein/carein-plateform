'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

const LABELS: Record<string, string> = {
  dashboard:        'Tableau de bord',
  campaigns:        'Campagnes',
  patients:         'Patients',
  encounters:       'Dossiers',
  exams:            'Examens',
  devices:          'Appareils',
  fleet:            'Parc matériel',
  tablets:          'Tablettes',
  'device-catalog': 'Catalogue appareils',
  facilities:       'Structures médicales',
  users:            'Utilisateurs',
  invitations:      'Invitations',
  analytics:        'Statistiques',
  reports:          'Rapports',
  new:              'Nouveau',
  edit:             'Modifier',
}

export function Breadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  const crumbs = segments.map((seg, i) => ({
    label: LABELS[seg] ?? seg,
    href: '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }))

  return (
    <nav className="flex items-center gap-1 text-sm">
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={14} className="text-foreground/30" />}
          {crumb.isLast ? (
            <span className="text-foreground font-medium">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="text-foreground/50 hover:text-foreground transition-colors">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
