'use client'

import { useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[CareIN Console — Fatal]', error)
  }, [error])

  return (
    <html lang="fr">
      <body className="h-screen flex items-center justify-center bg-[#F0FAF6] p-8">
        <div className="max-w-sm w-full text-center space-y-6">

          <div
            className="w-16 h-16 rounded-[18px] flex items-center justify-center mx-auto"
            style={{ background: 'linear-gradient(135deg, #00C896, #006B50)' }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h3l3-7 3 14 3-10 2 3h4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-extrabold tracking-tight">
              Erreur inattendue
            </h1>
            <p className="text-sm text-foreground/50">
              L&apos;application a rencontré un problème. Veuillez recharger la page.
            </p>
            {error.digest && (
              <p className="text-[10px] text-foreground/30 font-mono mt-2">ref: {error.digest}</p>
            )}
          </div>

          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-semibold bg-[#00C896] text-white hover:bg-[#009B73] transition-colors"
          >
            <RefreshCw size={14} />
            Recharger
          </button>
        </div>
      </body>
    </html>
  )
}
