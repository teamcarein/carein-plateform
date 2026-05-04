import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  formatDate, formatDatetime, formatAge, formatBmi,
  formatObjectiveType, formatCampaignStatus, formatEncounterStatus,
  formatEncounterType, formatExamCategory, formatUserRole,
  formatFacilityType, formatDeviceType, formatDeviceProtocol,
  formatDeviceStatus, formatExamStatus,
} from '../formatters'

describe('formatBmi', () => {
  it('rounds to one decimal', () => {
    expect(formatBmi(25.123)).toBe('25.1')
    expect(formatBmi(18.9)).toBe('18.9')
    expect(formatBmi(30)).toBe('30.0')
  })
})

describe('formatDate', () => {
  it('formats an ISO date in French locale', () => {
    expect(formatDate('2024-03-15')).toMatch(/15/)
    expect(formatDate('2024-03-15')).toMatch(/2024/)
  })
})

describe('formatDatetime', () => {
  it('includes date and time parts', () => {
    const result = formatDatetime('2024-03-15T14:30:00')
    expect(result).toMatch(/15/)
    expect(result).toMatch(/14/)
    expect(result).toMatch(/30/)
  })
})

describe('formatAge', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('calculates full years correctly', () => {
    vi.setSystemTime(new Date('2026-04-30'))
    expect(formatAge('1990-04-30')).toBe(36)
    expect(formatAge('1990-04-29')).toBe(36)
    expect(formatAge('1990-05-01')).toBe(35)
  })
})

describe('label formatters — known keys', () => {
  it('formatObjectiveType', () => {
    expect(formatObjectiveType('screening')).toBe('Dépistage')
    expect(formatObjectiveType('consultation')).toBe('Consultation')
    expect(formatObjectiveType('unknown_key')).toBe('unknown_key')
  })

  it('formatCampaignStatus', () => {
    expect(formatCampaignStatus('draft')).toBe('Brouillon')
    expect(formatCampaignStatus('active')).toBe('Active')
    expect(formatCampaignStatus('completed')).toBe('Terminée')
    expect(formatCampaignStatus('???')).toBe('???')
  })

  it('formatEncounterStatus', () => {
    expect(formatEncounterStatus('validated')).toBe('Validé')
    expect(formatEncounterStatus('needs_info')).toBe('Infos manquantes')
    expect(formatEncounterStatus('nope')).toBe('nope')
  })

  it('formatEncounterType', () => {
    expect(formatEncounterType('teleconsultation')).toBe('Téléconsultation')
    expect(formatEncounterType('campaign_visit')).toBe('Visite campagne')
  })

  it('formatExamCategory', () => {
    expect(formatExamCategory('cardio_metabolic')).toBe('Cardio-métabolique')
    expect(formatExamCategory('general')).toBe('Général')
  })

  it('formatUserRole', () => {
    expect(formatUserRole('admin')).toBe('Administrateur')
    expect(formatUserRole('nurse')).toBe('Infirmier(e)')
    expect(formatUserRole('ghost')).toBe('ghost')
  })

  it('formatFacilityType', () => {
    expect(formatFacilityType('hospital')).toBe('Hôpital')
    expect(formatFacilityType('mobile_unit')).toBe('Unité mobile')
  })

  it('formatDeviceType', () => {
    expect(formatDeviceType('blood_pressure')).toBe('Tensiomètre')
    expect(formatDeviceType('ecg')).toBe('ECG')
    expect(formatDeviceType('unknown')).toBe('unknown')
  })

  it('formatDeviceProtocol', () => {
    expect(formatDeviceProtocol('bluetooth')).toBe('Bluetooth')
    expect(formatDeviceProtocol('usb')).toBe('USB')
  })

  it('formatDeviceStatus', () => {
    expect(formatDeviceStatus('active')).toBe('Actif')
    expect(formatDeviceStatus('maintenance')).toBe('Maintenance')
  })

  it('formatExamStatus', () => {
    expect(formatExamStatus('completed')).toBe('Terminé')
    expect(formatExamStatus('pending')).toBe('En attente')
  })
})
