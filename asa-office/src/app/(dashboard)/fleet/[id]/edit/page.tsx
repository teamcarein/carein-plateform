'use client'

import { use } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Topbar } from '@/components/layout/topbar'
import { Card } from '@carein/ui-kit'
import { KitForm } from '@/components/fleet/kit-form'
import { useKit } from '@/features/fleet/hooks'

export default function EditKitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: kit, isLoading, isError } = useKit(id)

  if (isLoading) {
    return (
      <div>
        <Topbar />
        <div className="p-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 rounded-[8px] bg-foreground/5 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (isError || !kit) {
    return (
      <div>
        <Topbar />
        <div className="p-6">
          <p className="text-foreground/50 text-center py-20">Kit introuvable.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Topbar />
      <div className="p-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground mb-5 transition-colors"
        >
          <ArrowLeft size={14} /> Retour
        </button>
        <h1 className="text-lg font-semibold mb-5">Modifier la valise — {kit.code}</h1>
        <Card>
          <KitForm kit={kit} />
        </Card>
      </div>
    </div>
  )
}
