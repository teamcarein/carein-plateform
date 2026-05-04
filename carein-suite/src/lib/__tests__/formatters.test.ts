import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  formatDate, formatDateTime, formatRelative, countryLabel, COUNTRY_LABELS,
} from '../formatters'

describe('formatDate', () => {
  it('returns — for null/undefined', () => {
    expect(formatDate(null)).toBe('—')
    expect(formatDate(undefined)).toBe('—')
    expect(formatDate('')).toBe('—')
  })

  it('formats a valid ISO date in fr-FR (dd/mm/yyyy)', () => {
    const result = formatDate('2024-03-15')
    expect(result).toMatch(/15/)
    expect(result).toMatch(/03/)
    expect(result).toMatch(/2024/)
  })
})

describe('formatDateTime', () => {
  it('returns — for null', () => {
    expect(formatDateTime(null)).toBe('—')
  })

  it('includes date and time', () => {
    const result = formatDateTime('2024-03-15T14:30:00')
    expect(result).toMatch(/15/)
    expect(result).toMatch(/2024/)
    expect(result).toMatch(/14/)
    expect(result).toMatch(/30/)
  })
})

describe('formatRelative', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('returns À l\'instant for < 1 min ago', () => {
    vi.setSystemTime(new Date('2026-04-30T12:00:30Z'))
    expect(formatRelative('2026-04-30T12:00:00Z')).toBe("À l'instant")
  })

  it('returns Il y a N min', () => {
    vi.setSystemTime(new Date('2026-04-30T12:05:00Z'))
    expect(formatRelative('2026-04-30T12:00:00Z')).toBe('Il y a 5 min')
  })

  it('returns Il y a N h', () => {
    vi.setSystemTime(new Date('2026-04-30T15:00:00Z'))
    expect(formatRelative('2026-04-30T12:00:00Z')).toBe('Il y a 3 h')
  })

  it('returns Il y a N j', () => {
    vi.setSystemTime(new Date('2026-05-03T12:00:00Z'))
    expect(formatRelative('2026-04-30T12:00:00Z')).toBe('Il y a 3 j')
  })
})

describe('countryLabel', () => {
  it('returns localized label for known codes', () => {
    expect(countryLabel('CI')).toBe("Côte d'Ivoire")
    expect(countryLabel('SN')).toBe('Sénégal')
    expect(countryLabel('GH')).toBe('Ghana')
  })

  it('returns the code itself for unknown countries', () => {
    expect(countryLabel('XX')).toBe('XX')
    expect(countryLabel('US')).toBe('US')
  })

  it('COUNTRY_LABELS covers the 8 supported countries', () => {
    expect(Object.keys(COUNTRY_LABELS)).toHaveLength(8)
  })
})
