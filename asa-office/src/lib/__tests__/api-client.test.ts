import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiError, api } from '../api-client'

function mockFetch(status: number, body: unknown, ok = status >= 200 && status < 300) {
  return vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(body),
  }))
}

beforeEach(() => { vi.unstubAllGlobals() })

describe('ApiError', () => {
  it('carries status and message', () => {
    const err = new ApiError(404, 'Not found')
    expect(err.status).toBe(404)
    expect(err.message).toBe('Not found')
    expect(err.name).toBe('ApiError')
    expect(err).toBeInstanceOf(Error)
  })
})

describe('api.get — URL construction', () => {
  it('prepends /api/ and calls GET', async () => {
    mockFetch(200, { ok: true })
    await api.get('patients')
    const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(url).toBe('/api/patients')
    expect(init.method).toBe('GET')
  })

  it('strips leading slash from path', async () => {
    mockFetch(200, {})
    await api.get('/patients/123')
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(url).toBe('/api/patients/123')
  })

  it('appends non-empty params as query string', async () => {
    mockFetch(200, { data: [] })
    await api.get('patients', { page: 2, search: 'ali', gender: undefined, facility_id: null })
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(url).toContain('page=2')
    expect(url).toContain('search=ali')
    expect(url).not.toContain('gender')
    expect(url).not.toContain('facility_id')
  })

  it('omits query string when all params are empty', async () => {
    mockFetch(200, {})
    await api.get('patients', { search: '', page: undefined })
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(url).toBe('/api/patients')
  })
})

describe('api.post', () => {
  it('sends JSON body and Content-Type header', async () => {
    mockFetch(201, { id: 1 })
    await api.post('patients', { last_name: 'Koné' })
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(init.method).toBe('POST')
    expect(init.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(init.body)).toEqual({ last_name: 'Koné' })
  })
})

describe('api.patch', () => {
  it('sends PATCH with JSON body', async () => {
    mockFetch(200, { id: 1 })
    await api.patch('patients/abc', { phone: '+225' })
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(init.method).toBe('PATCH')
    expect(JSON.parse(init.body)).toEqual({ phone: '+225' })
  })
})

describe('error handling', () => {
  it('throws ApiError with backend message on non-ok response', async () => {
    mockFetch(422, { message: 'Validation failed' }, false)
    await expect(api.post('patients', {})).rejects.toMatchObject({
      status: 422,
      message: 'Validation failed',
    })
  })

  it('falls back to generic message when body has no message', async () => {
    mockFetch(500, {}, false)
    await expect(api.get('patients')).rejects.toMatchObject({
      status: 500,
      message: 'Erreur inconnue',
    })
  })

  it('returns undefined for 204 No Content', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 204 }))
    const result = await api.delete('patients/abc')
    expect(result).toBeUndefined()
  })
})
