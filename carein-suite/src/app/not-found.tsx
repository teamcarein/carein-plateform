import Link from 'next/link'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="h-screen flex items-center justify-center bg-background p-8">
      <div className="max-w-sm w-full text-center space-y-6">

        <div className="w-20 h-20 rounded-[20px] bg-primary/8 flex items-center justify-center mx-auto">
          <FileQuestion size={36} className="text-primary" />
        </div>

        <div className="space-y-1">
          <p className="text-6xl font-extrabold text-primary/20 tracking-tighter">404</p>
          <h1 className="text-xl font-extrabold tracking-tight -mt-2">Page introuvable</h1>
          <p className="text-sm text-foreground/50">
            Cette page n&apos;existe pas ou vous n&apos;avez pas les droits pour y accéder.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary-hover transition-colors"
        >
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  )
}
