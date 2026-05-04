'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react'

const STATUS_LABELS: Record<number, { title: string; hint: string }> = {
  400: { title: 'Requête invalide',       hint: 'Les données envoyées sont incorrectes.' },
  403: { title: 'Accès refusé',           hint: 'Vous n\'avez pas les droits nécessaires.' },
  404: { title: 'Ressource introuvable',  hint: 'L\'élément demandé n\'existe pas ou a été supprimé.' },
  409: { title: 'Conflit',               hint: 'L\'opération entre en conflit avec l\'état actuel.' },
  422: { title: 'Données invalides',      hint: 'Vérifiez les champs du formulaire.' },
  429: { title: 'Trop de requêtes',       hint: 'Patientez quelques instants avant de réessayer.' },
  500: { title: 'Erreur serveur',         hint: 'Une erreur interne s\'est produite. Réessayez plus tard.' },
  503: { title: 'Service indisponible',   hint: 'Le serveur est temporairement inaccessible.' },
}

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string; status?: number }
  reset: () => void
}) {
  const router = useRouter()
  const status  = error.status ?? (error.message.match(/\b([45]\d{2})\b/)?.[1] ? parseInt(error.message.match(/\b([45]\d{2})\b/)![1]) : 500)
  const label   = STATUS_LABELS[status] ?? STATUS_LABELS[500]

  useEffect(() => {
    console.error('[CareIN Cockpit]', error)
  }, [error])

  return (
    <div className="flex-1 flex items-center justify-center p-8 min-h-[60vh]">
      <div className="max-w-md w-full text-center space-y-6">

        {/* Icon + code */}
        <div className="relative inline-flex">
          <div className="w-20 h-20 rounded-[20px] bg-danger/8 flex items-center justify-center">
            <AlertTriangle size={36} className="text-danger" />
          </div>
          <span className="absolute -top-2 -right-3 text-[11px] font-bold bg-danger text-white px-2 py-0.5 rounded-full">
            {status}
          </span>
        </div>

        {/* Message */}
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold tracking-tight">{label.title}</h1>
          <p className="text-sm text-foreground/50">{label.hint}</p>
          {error.message && error.message !== label.title && (
            <p className="mt-3 text-xs font-mono bg-foreground/5 border border-border rounded-[8px] px-3 py-2 text-foreground/40 break-all">
              {error.message}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-sm font-semibold border border-border hover:bg-surface transition-colors"
          >
            <ArrowLeft size={14} />
            Retour
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary-hover transition-colors"
          >
            <RefreshCw size={14} />
            Réessayer
          </button>
        </div>

        {error.digest && (
          <p className="text-[10px] text-foreground/25 font-mono">
            ref: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
