import { Search } from 'lucide-react'
import { Breadcrumb } from './breadcrumb'

export function Topbar() {
  return (
    <header className="h-12 flex items-center justify-between px-6 border-b border-border bg-surface">
      <Breadcrumb />
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
          <input
            type="search"
            placeholder="Rechercher…"
            className="h-7 pl-8 pr-3 text-xs rounded-[6px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary w-48"
          />
        </div>
      </div>
    </header>
  )
}
