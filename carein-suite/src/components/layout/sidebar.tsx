'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  Mail,
  UserCheck,
  ScrollText,
  TrendingUp,
  Settings,
  Users,
  LogOut,
  Cpu,
  Activity,
} from 'lucide-react'
import { cn } from '@carein/ui-kit'
import { logoutAction } from '@/features/auth/actions'

const NAV_ITEMS = [
  { href: '/dashboard',       label: 'Dashboard',        icon: LayoutDashboard },
  { href: '/brand-operators', label: 'Brand Operators',  icon: Building2       },
  { href: '/invitations',     label: 'Invitations',      icon: Mail            },
  { href: '/modules',         label: 'Modules',          icon: Settings        },
  { href: '/device-catalog',  label: 'Catalogue devices', icon: Cpu            },
  { href: '/analytics',       label: 'Analytics',        icon: TrendingUp      },
  { href: '/fleet',           label: 'Fleet 360°',       icon: Activity        },
  { href: '/impersonation',   label: 'Impersonation',    icon: UserCheck       },
  { href: '/audit',           label: 'Audit',            icon: ScrollText      },
  { href: '/carein-team',     label: 'Équipe CareIN',    icon: Users           },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] bg-sidebar flex flex-col z-30">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center shrink-0">
          <span className="text-primary-foreground font-bold text-sm">C</span>
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-none">CareIN</p>
          <p className="text-[10px] text-white/50 mt-0.5">Cockpit Éditeur</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-sm transition-all',
                active
                  ? 'bg-sidebar-active text-white border-l-2 border-primary pl-[10px]'
                  : 'text-white/50 hover:text-white hover:bg-white/5',
              )}
            >
              <Icon size={15} className={active ? 'text-primary' : ''} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all w-full"
          >
            <LogOut size={15} />
            Déconnexion
          </button>
        </form>
      </div>
    </aside>
  )
}
