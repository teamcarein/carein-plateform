'use client'

import { useEffect } from 'react'
import { RefreshCw, AlertOctagon } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[CareIN Cockpit — Fatal]', error)
  }, [error])

  return (
    <html lang="fr">
      <body className="h-screen flex items-center justify-center bg-[#0D1117] p-8">
        <div className="max-w-sm w-full text-center space-y-6">

          <div className="w-20 h-20 rounded-[20px] bg-red-500/10 flex items-center justify-center mx-auto border border-red-500/20">
            <AlertOctagon size={36} className="text-red-400" />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-extrabold tracking-tight text-white">
              Erreur critique
            </h1>
            <p className="text-sm text-white/40">
              Une erreur inattendue a empêché le chargement de l&apos;application.
            </p>
            {error.digest && (
              <p className="text-[10px] text-white/20 font-mono mt-2">ref: {error.digest}</p>
            )}
          </div>

          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-semibold bg-white/10 text-white hover:bg-white/15 transition-colors border border-white/10"
          >
            <RefreshCw size={14} />
            Recharger l&apos;application
          </button>
        </div>
      </body>
    </html>
  )
}
