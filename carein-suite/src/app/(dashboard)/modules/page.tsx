import { getBrandOperators } from '@/features/brand-operators/api'
import { BOModulesCard } from './bo-modules-card'

const MODULES = [
  { code: 'BC1', label: 'Clinical',         description: 'Dossiers patients, examens, rencontres' },
  { code: 'BC2', label: 'Téléconsultation', description: 'Consultations vidéo et messagerie médicale' },
  { code: 'BC3', label: 'Campagnes',        description: 'Campagnes de dépistage terrain' },
  { code: 'BC4', label: 'Imaging DICOM',    description: 'Imagerie médicale et PACS' },
  { code: 'BC5', label: 'Fleet & IoT',      description: 'Gestion kits médicaux connectés' },
  { code: 'BC6', label: 'Pharmacie',        description: 'Gestion stock médicaments' },
]

export default async function ModulesPage() {
  let bos: Awaited<ReturnType<typeof getBrandOperators>>['data'] = []
  try {
    const res = await getBrandOperators()
    bos = res.data
  } catch { /* show empty state */ }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold">Modules</h1>
        <p className="text-sm text-foreground/50 mt-0.5">Configuration des modules par Brand Operator</p>
      </div>

      {bos.length === 0 && (
        <p className="text-sm text-foreground/40 text-center py-12">Aucun tenant enregistré</p>
      )}

      {bos.map((bo) => {
        const enabledModules: string[] = (bo.settings as Record<string, string[]> | null)?.modules ?? []

        return (
          <BOModulesCard
            key={bo.id}
            boCode={bo.code}
            boName={bo.name}
            initialModules={enabledModules}
            allModules={MODULES}
          />
        )
      })}
    </div>
  )
}
