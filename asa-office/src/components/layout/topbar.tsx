import { Breadcrumb } from './breadcrumb'

type TopbarProps = {
  actions?: React.ReactNode
}

export function Topbar({ actions }: TopbarProps) {
  return (
    <header className="h-12 flex items-center justify-between px-6 border-b border-border bg-surface">
      <Breadcrumb />
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  )
}
