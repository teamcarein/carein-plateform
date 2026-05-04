import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'dd MMM yyyy', { locale: fr })
}

export function formatDatetime(dateStr: string): string {
  return format(parseISO(dateStr), 'dd MMM yyyy HH:mm', { locale: fr })
}

export function formatRelative(dateStr: string): string {
  return formatDistanceToNow(parseISO(dateStr), { addSuffix: true, locale: fr })
}

export function formatAge(birthDate: string): number {
  const birth = parseISO(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

export function formatBmi(bmi: number): string {
  return bmi.toFixed(1)
}

export function formatObjectiveType(type: string): string {
  const labels: Record<string, string> = {
    screening:    'Dépistage',
    consultation: 'Consultation',
    vaccination:  'Vaccination',
    follow_up:    'Suivi',
    other:        'Autre',
  }
  return labels[type] ?? type
}

export function formatCampaignStatus(status: string): string {
  const labels: Record<string, string> = {
    draft:     'Brouillon',
    planned:   'Planifiée',
    active:    'Active',
    paused:    'En pause',
    completed: 'Terminée',
    cancelled: 'Annulée',
  }
  return labels[status] ?? status
}

export function formatEncounterStatus(status: string): string {
  const labels: Record<string, string> = {
    draft:           'Brouillon',
    in_progress:     'En cours',
    awaiting_review: 'En attente de revue',
    under_review:    'En revue',
    needs_info:      'Infos manquantes',
    validated:       'Validé',
    cancelled:       'Annulé',
  }
  return labels[status] ?? status
}

export function formatEncounterType(type: string): string {
  const labels: Record<string, string> = {
    in_person:        'Présentiel',
    teleconsultation: 'Téléconsultation',
    campaign_visit:   'Visite campagne',
  }
  return labels[type] ?? type
}

export function formatExamCategory(category: string): string {
  const labels: Record<string, string> = {
    cardio_metabolic: 'Cardio-métabolique',
    general:          'Général',
    ophtalmo:         'Ophtalmologie',
    dental:           'Dentaire',
    mental_health:    'Santé mentale',
    gynecology:       'Gynécologie',
  }
  return labels[category] ?? category
}

export function formatUserRole(role: string): string {
  const labels: Record<string, string> = {
    admin:      'Administrateur',
    supervisor: 'Superviseur',
    nurse:      'Infirmier(e)',
    technician: 'Technicien',
    agent:      'Agent terrain',
  }
  return labels[role] ?? role
}

export function formatFacilityType(type: string): string {
  const labels: Record<string, string> = {
    clinic:        'Clinique',
    hospital:      'Hôpital',
    health_center: 'Centre de santé',
    mobile_unit:   'Unité mobile',
    other:         'Autre',
  }
  return labels[type] ?? type
}

export function formatDeviceType(type: string): string {
  const labels: Record<string, string> = {
    blood_pressure: 'Tensiomètre',
    pulse_oximeter: 'Oxymètre de pouls',
    ecg:            'ECG',
    glucometer:     'Glucomètre',
    scale:          'Balance médicale',
    thermometer:    'Thermomètre',
    spirometer:     'Spiromètre',
    other:          'Autre',
  }
  return labels[type] ?? type
}

export function formatDeviceProtocol(protocol: string): string {
  const labels: Record<string, string> = {
    usb:       'USB',
    bluetooth: 'Bluetooth',
    network:   'Réseau',
  }
  return labels[protocol] ?? protocol
}

export function formatDeviceStatus(status: string): string {
  const labels: Record<string, string> = {
    active:      'Actif',
    inactive:    'Inactif',
    maintenance: 'Maintenance',
  }
  return labels[status] ?? status
}

export function formatExamStatus(status: string): string {
  const labels: Record<string, string> = {
    pending:     'En attente',
    in_progress: 'En cours',
    completed:   'Terminé',
  }
  return labels[status] ?? status
}
