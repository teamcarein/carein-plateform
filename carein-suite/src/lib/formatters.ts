export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
      .format(new Date(iso))
  } catch { return '—' }
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date(iso))
  } catch { return '—' }
}

export function formatRelative(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime()
    const min  = Math.floor(diff / 60000)
    const h    = Math.floor(diff / 3600000)
    const d    = Math.floor(diff / 86400000)
    if (min < 1)  return 'À l\'instant'
    if (min < 60) return `Il y a ${min} min`
    if (h < 24)   return `Il y a ${h} h`
    return `Il y a ${d} j`
  } catch { return '—' }
}

export const COUNTRY_LABELS: Record<string, string> = {
  CI: 'Côte d\'Ivoire',
  CG: 'Congo-Brazzaville',
  SN: 'Sénégal',
  GH: 'Ghana',
  ML: 'Mali',
  BF: 'Burkina Faso',
  CM: 'Cameroun',
  TG: 'Togo',
}

export function countryLabel(code: string): string {
  return COUNTRY_LABELS[code] ?? code
}
