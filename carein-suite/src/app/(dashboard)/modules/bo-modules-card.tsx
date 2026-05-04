'use client'

import { useState, useTransition } from 'react'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@carein/ui-kit'
import { updateTenantModulesAction } from '@/features/modules/actions'

interface Module {
  code:        string
  label:       string
  description: string
}

interface BOModulesCardProps {
  boCode:         string
  boName:         string
  initialModules: string[]
  allModules:     Module[]
}

export function BOModulesCard({ boCode, boName, initialModules, allModules }: BOModulesCardProps) {
  const [modules, setModules] = useState<string[]>(initialModules)
  const [error, setError]     = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function toggle(code: string) {
    const next = modules.includes(code)
      ? modules.filter(m => m !== code)
      : [...modules, code]

    setModules(next)
    setError(null)

    startTransition(async () => {
      const res = await updateTenantModulesAction(boCode, next)
      if (!res.success) {
        setModules(modules)
        setError(res.error)
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 flex-1">
          <CardTitle>{boName}</CardTitle>
          {pending && <Loader2 size={13} className="text-foreground/30 animate-spin" />}
        </div>
        <span className="font-mono text-xs text-foreground/40">{boCode}</span>
      </CardHeader>

      {error && (
        <p className="text-xs text-danger mb-3">{error}</p>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {allModules.map((mod) => {
          const enabled = modules.includes(mod.code)
          return (
            <button
              key={mod.code}
              onClick={() => toggle(mod.code)}
              disabled={pending}
              className="flex items-center justify-between px-3 py-2.5 rounded-[6px] border border-border text-left transition-colors hover:bg-foreground/3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-foreground/40">{mod.code}</span>
                <div>
                  <p className="text-sm font-medium">{mod.label}</p>
                  <p className="text-xs text-foreground/40">{mod.description}</p>
                </div>
              </div>
              {enabled
                ? <CheckCircle size={16} className="text-success shrink-0" />
                : <XCircle    size={16} className="text-foreground/20 shrink-0" />
              }
            </button>
          )
        })}
      </div>
    </Card>
  )
}
