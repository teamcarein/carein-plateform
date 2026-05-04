'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  MapPin,
  Users,
  Stethoscope,
  ClipboardList,
  Cpu,
  Building2,
  UserCog,
  BarChart3,
  FileText,
  LogOut,
  Package,
  Tablet,
  Mail,
  BookOpen,
  Settings,
} from 'lucide-react'
import { cn } from '@carein/ui-kit'
import { useAuth } from '@/hooks/use-auth'

type NavItem = {
  href:     string
  label:    string
  icon:     React.ElementType
  exact?:   boolean
  children?: { href: string; label: string; icon: React.ElementType }[]
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard',  label: 'Tableau de bord', icon: LayoutDashboard, exact: true },
  { href: '/campaigns',  label: 'Campagnes',       icon: MapPin      },
  { href: '/patients',   label: 'Patients',        icon: Users       },
  { href: '/encounters', label: 'Dossiers',        icon: Stethoscope },
  { href: '/exams',      label: 'Examens',         icon: ClipboardList },
  {
    href: '/fleet', label: 'Parc matériel', icon: Package,
    children: [
      { href: '/fleet/tablets',  label: 'Tablettes', icon: Tablet   },
      { href: '/devices',        label: 'Appareils', icon: Cpu      },
      { href: '/device-catalog', label: 'Catalogue', icon: BookOpen },
    ],
  },
  { href: '/facilities',     label: 'Structures',   icon: Building2   },
  { href: '/users',          label: 'Utilisateurs', icon: UserCog     },
  { href: '/invitations',    label: 'Invitations',  icon: Mail        },
  { href: '/analytics',      label: 'Statistiques', icon: BarChart3   },
  { href: '/reports',        label: 'Rapports',     icon: FileText    },
]

export function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <aside className="fixed left-0 top-0 h-full w-[220px] bg-sidebar flex flex-col z-30">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-white/8">
        <span className="text-base font-bold text-white tracking-tight">
          CareIN <span className="text-primary">Console</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact, children }) => {
          const childActive = children?.some(c => pathname === c.href || pathname.startsWith(c.href + '/'))
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(href + '/') || !!childActive

          return (
            <div key={href}>
              <Link
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm transition-all',
                  active && !childActive
                    ? 'bg-sidebar-active text-white border-l-2 border-primary pl-[10px]'
                    : childActive
                    ? 'text-white/70 hover:text-white hover:bg-white/5'
                    : 'text-white/50 hover:text-white hover:bg-white/5',
                )}
              >
                <Icon size={16} className={active ? 'text-primary' : ''} />
                {label}
              </Link>

              {/* Sub-items — visible when on parent or any child route */}
              {children && (pathname.startsWith(href) || childActive) && (
                <div className="ml-4 mt-0.5 space-y-0.5 border-l border-white/10 pl-3">
                  {children.map(({ href: chHref, label: chLabel, icon: ChIcon }) => {
                    const chActive = pathname === chHref || pathname.startsWith(chHref + '/')
                    return (
                      <Link
                        key={chHref}
                        href={chHref}
                        className={cn(
                          'flex items-center gap-2 px-2 py-2 rounded-[6px] text-xs transition-all',
                          chActive
                            ? 'bg-sidebar-active text-white'
                            : 'text-white/40 hover:text-white hover:bg-white/5',
                        )}
                      >
                        <ChIcon size={13} className={chActive ? 'text-primary' : ''} />
                        {chLabel}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Settings + Logout */}
      <div className="px-3 py-4 border-t border-white/8 space-y-0.5">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm transition-all',
            pathname === '/settings'
              ? 'bg-sidebar-active text-white border-l-2 border-primary pl-[10px]'
              : 'text-white/50 hover:text-white hover:bg-white/5',
          )}
        >
          <Settings size={16} className={pathname === '/settings' ? 'text-primary' : ''} />
          Paramètres
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all w-full"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
