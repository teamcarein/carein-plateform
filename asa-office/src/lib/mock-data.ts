import type { Campaign, Patient, Encounter, Exam, Measurement, Device, Facility, User, PaginatedResponse } from '@/types'

export const MOCK_FACILITIES: Facility[] = [
  {
    id: 'f1', name: 'Centre de Santé Abidjan Nord', code: 'CSA-001',
    address: 'Quartier Abobo', city: 'Abidjan', country: 'Côte d\'Ivoire',
    is_active: true, users_count: 8,
    created_at: '2024-01-10T08:00:00Z',
  },
  {
    id: 'f2', name: 'Hôpital Général de Bouaké', code: 'HGB-001',
    address: 'Centre-ville', city: 'Bouaké', country: 'Côte d\'Ivoire',
    is_active: true, users_count: 15,
    created_at: '2024-02-15T08:00:00Z',
  },
  {
    id: 'f3', name: 'Centre Médical Katiola', code: 'CMK-001',
    city: 'Katiola', country: 'Côte d\'Ivoire',
    is_active: true, users_count: 5,
    created_at: '2024-04-01T08:00:00Z',
  },
  {
    id: 'f4', name: 'Unité Mobile Mankono', code: 'UMM-001',
    city: 'Mankono', country: 'Côte d\'Ivoire',
    is_active: false, users_count: 3,
    created_at: '2024-06-15T08:00:00Z',
  },
]

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'c1', name: 'Campagne Village Katiola',
    objective_type: 'screening', description: 'Dépistage population rurale 18-65 ans',
    target_pathologies: ['hypertension', 'diabete'],
    starts_at: '2025-03-01', ends_at: '2025-03-15',
    status: 'completed', quota_per_day: 30, quota_per_site: 150, quota_total: 350,
    launched_at: '2025-03-01T07:00:00Z',
    organization: { id: 'f2', name: 'Hôpital Général de Bouaké', type: 'hospital' },
    sites: [], protocols: [],
  },
  {
    id: 'c2', name: 'Dépistage Entreprise SITAB',
    objective_type: 'screening', description: 'Dépistage employés SITAB',
    target_pathologies: ['hypertension', 'cholesterol'],
    starts_at: '2025-04-10', ends_at: '2025-04-30',
    status: 'active', quota_per_day: 20, quota_per_site: 200,
    launched_at: '2025-04-10T08:00:00Z',
    organization: { id: 'f1', name: 'Centre de Santé Abidjan Nord', type: 'clinic' },
    sites: [], protocols: [],
  },
  {
    id: 'c3', name: 'Campagne Urbaine Cocody',
    objective_type: 'consultation', description: 'Consultations résidents Cocody',
    starts_at: '2025-05-05', ends_at: '2025-05-25',
    status: 'planned', quota_per_day: 25, quota_per_site: 100,
    organization: { id: 'f1', name: 'Centre de Santé Abidjan Nord', type: 'clinic' },
    sites: [], protocols: [],
  },
  {
    id: 'c4', name: 'Village Santé Mankono',
    objective_type: 'screening', description: 'Dépistage population rurale Mankono',
    target_pathologies: ['malaria', 'tuberculosis'],
    starts_at: '2025-02-01', ends_at: '2025-02-20',
    status: 'completed', quota_per_day: 25, quota_per_site: 120, quota_total: 220,
    launched_at: '2025-02-01T07:00:00Z',
    organization: { id: 'f2', name: 'Hôpital Général de Bouaké', type: 'hospital' },
    sites: [], protocols: [],
  },
]

export const MOCK_PATIENTS: Patient[] = [
  { id: 'p1', campaign_id: 'c2', patient_code: 'ASA-2025-00001', first_name: 'Kouamé', last_name: 'Adjoua', birth_date: '1985-06-12', gender: 'male', blood_type: 'O+', phone: '+225 07 12 34 56', height_cm: 172, weight_kg: 78, bmi: 26.4, facility: { id: 'f1', name: 'Centre de Santé Abidjan Nord' }, created_at: '2025-04-10T09:15:00Z' },
  { id: 'p2', campaign_id: 'c2', patient_code: 'ASA-2025-00002', first_name: 'Aïcha', last_name: 'Coulibaly', birth_date: '1992-11-03', gender: 'female', blood_type: 'A+', phone: '+225 05 98 76 54', height_cm: 163, weight_kg: 61, bmi: 22.9, facility: { id: 'f1', name: 'Centre de Santé Abidjan Nord' }, created_at: '2025-04-10T10:00:00Z' },
  { id: 'p3', campaign_id: 'c2', patient_code: 'ASA-2025-00003', first_name: 'Yves', last_name: 'Brou', birth_date: '1978-03-25', gender: 'male', blood_type: 'B+', height_cm: 168, weight_kg: 92, bmi: 32.6, facility: { id: 'f1', name: 'Centre de Santé Abidjan Nord' }, created_at: '2025-04-11T08:30:00Z' },
  { id: 'p4', campaign_id: 'c2', patient_code: 'ASA-2025-00004', first_name: 'Fatou', last_name: 'Traoré', birth_date: '1990-08-17', gender: 'female', phone: '+225 01 23 45 67', height_cm: 158, weight_kg: 55, bmi: 22.0, facility: { id: 'f1', name: 'Centre de Santé Abidjan Nord' }, created_at: '2025-04-11T09:45:00Z' },
  { id: 'p5', campaign_id: 'c1', patient_code: 'ASA-2025-00005', last_name: 'Koné', birth_date: '1965-01-30', gender: 'male', blood_type: 'AB+', height_cm: 175, weight_kg: 85, bmi: 27.8, facility: { id: 'f2', name: 'Hôpital Général de Bouaké' }, created_at: '2025-03-02T07:45:00Z' },
  { id: 'p6', campaign_id: 'c1', patient_code: 'ASA-2025-00006', first_name: 'Marie', last_name: 'Djédjé', birth_date: '2000-04-22', gender: 'female', blood_type: 'O-', height_cm: 160, weight_kg: 52, bmi: 20.3, facility: { id: 'f2', name: 'Hôpital Général de Bouaké' }, created_at: '2025-03-02T08:00:00Z' },
  { id: 'p7', campaign_id: 'c4', patient_code: 'ASA-2025-00007', first_name: 'Ibrahim', last_name: 'Ouattara', birth_date: '1955-09-10', gender: 'male', blood_type: 'A-', height_cm: 170, weight_kg: 68, bmi: 23.5, facility: { id: 'f2', name: 'Hôpital Général de Bouaké' }, created_at: '2025-02-03T07:00:00Z' },
  { id: 'p8', campaign_id: 'c4', patient_code: 'ASA-2025-00008', first_name: 'Aminata', last_name: 'Doumbia', birth_date: '1988-12-05', gender: 'female', blood_type: 'B-', height_cm: 165, weight_kg: 70, bmi: 25.7, facility: { id: 'f2', name: 'Hôpital Général de Bouaké' }, created_at: '2025-02-03T08:15:00Z' },
]

export const MOCK_ENCOUNTERS: Encounter[] = [
  {
    id: 'enc1', patient_id: 'p1', campaign_id: 'c2', facility_id: 'f1',
    type: 'campaign_visit', status: 'validated', started_at: '2025-04-10T09:15:00Z',
    risk_score: 42,
    patient: { id: 'p1', patient_code: 'ASA-2025-00001', first_name: 'Kouamé', last_name: 'Adjoua' },
    facility: { id: 'f1', name: 'Centre de Santé Abidjan Nord' },
  },
  {
    id: 'enc2', patient_id: 'p2', campaign_id: 'c2', facility_id: 'f1',
    type: 'campaign_visit', status: 'validated', started_at: '2025-04-10T10:00:00Z',
    risk_score: 12,
    patient: { id: 'p2', patient_code: 'ASA-2025-00002', first_name: 'Aïcha', last_name: 'Coulibaly' },
    facility: { id: 'f1', name: 'Centre de Santé Abidjan Nord' },
  },
  {
    id: 'enc3', patient_id: 'p3', campaign_id: 'c2', facility_id: 'f1',
    type: 'campaign_visit', status: 'awaiting_review', started_at: '2025-04-11T08:30:00Z',
    risk_score: 78,
    patient: { id: 'p3', patient_code: 'ASA-2025-00003', first_name: 'Yves', last_name: 'Brou' },
    facility: { id: 'f1', name: 'Centre de Santé Abidjan Nord' },
  },
  {
    id: 'enc4', patient_id: 'p4', campaign_id: 'c2', facility_id: 'f1',
    type: 'campaign_visit', status: 'in_progress', started_at: '2025-04-11T09:45:00Z',
    patient: { id: 'p4', patient_code: 'ASA-2025-00004', first_name: 'Fatou', last_name: 'Traoré' },
    facility: { id: 'f1', name: 'Centre de Santé Abidjan Nord' },
  },
  {
    id: 'enc5', patient_id: 'p5', campaign_id: 'c1', facility_id: 'f2',
    type: 'campaign_visit', status: 'validated', started_at: '2025-03-02T07:45:00Z',
    risk_score: 65,
    patient: { id: 'p5', patient_code: 'ASA-2025-00005', last_name: 'Koné' },
    facility: { id: 'f2', name: 'Hôpital Général de Bouaké' },
  },
  {
    id: 'enc6', patient_id: 'p6', campaign_id: 'c1', facility_id: 'f2',
    type: 'campaign_visit', status: 'validated', started_at: '2025-03-02T08:00:00Z',
    risk_score: 8,
    patient: { id: 'p6', patient_code: 'ASA-2025-00006', first_name: 'Marie', last_name: 'Djédjé' },
    facility: { id: 'f2', name: 'Hôpital Général de Bouaké' },
  },
  {
    id: 'enc7', patient_id: 'p7', campaign_id: 'c4', facility_id: 'f2',
    type: 'campaign_visit', status: 'validated', started_at: '2025-02-03T07:00:00Z',
    risk_score: 55,
    patient: { id: 'p7', patient_code: 'ASA-2025-00007', first_name: 'Ibrahim', last_name: 'Ouattara' },
    facility: { id: 'f2', name: 'Hôpital Général de Bouaké' },
  },
  {
    id: 'enc8', patient_id: 'p8', campaign_id: 'c4', facility_id: 'f2',
    type: 'campaign_visit', status: 'validated', started_at: '2025-02-03T08:15:00Z',
    risk_score: 30,
    patient: { id: 'p8', patient_code: 'ASA-2025-00008', first_name: 'Aminata', last_name: 'Doumbia' },
    facility: { id: 'f2', name: 'Hôpital Général de Bouaké' },
  },
]

export const MOCK_EXAMS: Exam[] = [
  { id: 'e1', encounter_id: 'enc1', category: 'cardio_metabolic', status: 'completed', risk_score: 42, started_at: '2025-04-10T09:30:00Z', completed_at: '2025-04-10T10:00:00Z' },
  { id: 'e2', encounter_id: 'enc2', category: 'general', status: 'completed', risk_score: 12, started_at: '2025-04-10T10:15:00Z', completed_at: '2025-04-10T10:45:00Z' },
  { id: 'e3', encounter_id: 'enc3', category: 'cardio_metabolic', status: 'completed', risk_score: 78, started_at: '2025-04-11T08:45:00Z', completed_at: '2025-04-11T09:30:00Z' },
  { id: 'e4', encounter_id: 'enc4', category: 'general', status: 'in_progress', started_at: '2025-04-11T10:00:00Z' },
  { id: 'e5', encounter_id: 'enc5', category: 'cardio_metabolic', status: 'completed', risk_score: 65, started_at: '2025-03-02T08:00:00Z', completed_at: '2025-03-02T08:45:00Z' },
  { id: 'e6', encounter_id: 'enc6', category: 'general', status: 'completed', risk_score: 8, started_at: '2025-03-02T08:15:00Z', completed_at: '2025-03-02T08:50:00Z' },
  { id: 'e7', encounter_id: 'enc7', category: 'cardio_metabolic', status: 'completed', risk_score: 55, started_at: '2025-02-03T07:15:00Z', completed_at: '2025-02-03T08:00:00Z' },
  { id: 'e8', encounter_id: 'enc8', category: 'general', status: 'completed', risk_score: 30, started_at: '2025-02-03T08:30:00Z', completed_at: '2025-02-03T09:00:00Z' },
]

export const MOCK_MEASUREMENTS: Measurement[] = [
  { id: 'm1', exam_id: 'e1', device_id: 'd1', type: 'blood_pressure', value: { systolic: 148, diastolic: 92 }, unit: 'mmHg', is_abnormal: true, measured_at: '2025-04-10T09:35:00Z' },
  { id: 'm2', exam_id: 'e1', device_id: 'd2', type: 'heart_rate', value: { bpm: 88 }, unit: 'bpm', is_abnormal: false, measured_at: '2025-04-10T09:38:00Z' },
  { id: 'm3', exam_id: 'e1', device_id: 'd3', type: 'spo2', value: { percent: 97 }, unit: '%', is_abnormal: false, measured_at: '2025-04-10T09:40:00Z' },
  { id: 'm4', exam_id: 'e3', device_id: 'd1', type: 'blood_pressure', value: { systolic: 175, diastolic: 110 }, unit: 'mmHg', is_abnormal: true, measured_at: '2025-04-11T08:50:00Z' },
  { id: 'm5', exam_id: 'e3', device_id: 'd4', type: 'ecg', value: { rhythm: 'irregular', rate: 95 }, unit: 'bpm', is_abnormal: true, measured_at: '2025-04-11T09:00:00Z' },
  { id: 'm6', exam_id: 'e2', device_id: 'd1', type: 'blood_pressure', value: { systolic: 118, diastolic: 76 }, unit: 'mmHg', is_abnormal: false, measured_at: '2025-04-10T10:20:00Z' },
]

export const MOCK_DEVICES: Device[] = [
  { id: 'd1', facility_id: 'f1', serial: 'BP-2024-001', name: 'Tensiomètre OMR-910', type: 'blood_pressure', protocol: 'bluetooth', status: 'active', last_seen_at: '2025-04-18T08:00:00Z', facility: { id: 'f1', name: 'Centre de Santé Abidjan Nord' } },
  { id: 'd2', facility_id: 'f1', serial: 'HR-2024-002', name: 'Oxymètre Nonin 3230', type: 'pulse_oximeter', protocol: 'bluetooth', status: 'active', last_seen_at: '2025-04-18T07:45:00Z', facility: { id: 'f1', name: 'Centre de Santé Abidjan Nord' } },
  { id: 'd3', facility_id: 'f2', serial: 'EC-2023-001', name: 'ECG Schiller AT-102', type: 'ecg', protocol: 'usb', status: 'active', last_seen_at: '2025-04-17T16:30:00Z', facility: { id: 'f2', name: 'Hôpital Général de Bouaké' } },
  { id: 'd4', facility_id: 'f2', serial: 'GL-2024-003', name: 'Glucomètre Accu-Chek', type: 'glucometer', protocol: 'bluetooth', status: 'maintenance', last_seen_at: '2025-04-10T09:00:00Z', facility: { id: 'f2', name: 'Hôpital Général de Bouaké' } },
  { id: 'd5', facility_id: 'f1', serial: 'SC-2023-002', name: 'Balance Médicale Seca', type: 'scale', protocol: 'bluetooth', status: 'inactive', last_seen_at: '2025-03-01T08:00:00Z', facility: { id: 'f1', name: 'Centre de Santé Abidjan Nord' } },
  { id: 'd6', facility_id: 'f2', serial: 'TH-2024-004', name: 'Thermomètre Braun', type: 'thermometer', protocol: 'bluetooth', status: 'active', last_seen_at: '2025-04-18T09:00:00Z', facility: { id: 'f2', name: 'Hôpital Général de Bouaké' } },
]

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Dr. Kouassi Fernand', email: 'superadmin@chereh.test', role: 'admin', facility_id: 'f1', facility: { id: 'f1', name: 'Centre de Santé Abidjan Nord' }, phone: '+225 07 00 11 22', is_active: true, last_login_at: '2025-04-18T08:05:00Z', created_at: '2024-01-01T00:00:00Z' },
  { id: 'u2', name: 'Infirmier Soumahoro', email: 'soumahoro@asa.test', role: 'nurse', facility_id: 'f2', facility: { id: 'f2', name: 'Hôpital Général de Bouaké' }, phone: '+225 05 88 77 66', is_active: true, last_login_at: '2025-04-18T07:30:00Z', created_at: '2024-03-15T00:00:00Z' },
  { id: 'u3', name: 'Technicien Diallo', email: 'diallo@asa.test', role: 'technician', facility_id: 'f1', facility: { id: 'f1', name: 'Centre de Santé Abidjan Nord' }, is_active: true, last_login_at: '2025-04-17T14:00:00Z', created_at: '2024-06-01T00:00:00Z' },
  { id: 'u4', name: 'Superviseure Koné Awa', email: 'kone.awa@asa.test', role: 'supervisor', facility_id: 'f2', facility: { id: 'f2', name: 'Hôpital Général de Bouaké' }, phone: '+225 01 44 55 66', is_active: true, last_login_at: '2025-04-16T09:00:00Z', created_at: '2024-05-10T00:00:00Z' },
  { id: 'u5', name: 'Agent Traoré Moussa', email: 'traore.moussa@asa.test', role: 'agent', facility_id: 'f3', facility: { id: 'f3', name: 'Centre Médical Katiola' }, phone: '+225 07 33 22 11', is_active: false, last_login_at: '2025-03-10T10:00:00Z', created_at: '2024-07-20T00:00:00Z' },
  { id: 'u6', name: 'Infirmière Diabaté Fatoumata', email: 'diabate.f@asa.test', role: 'nurse', facility_id: 'f3', facility: { id: 'f3', name: 'Centre Médical Katiola' }, is_active: true, last_login_at: '2025-04-15T11:00:00Z', created_at: '2024-09-01T00:00:00Z' },
]


function paginate<T>(items: T[], page = 1, perPage = 15): PaginatedResponse<T> {
  const total = items.length
  const lastPage = Math.ceil(total / perPage)
  const start = (page - 1) * perPage
  return {
    data: items.slice(start, start + perPage),
    meta: { current_page: page, last_page: lastPage, per_page: perPage, total },
  }
}

export const mockDb = {
  facilities: {
    list: (filters: { active_only?: boolean; page?: number; per_page?: number } = {}) => {
      let items = [...MOCK_FACILITIES]
      if (filters.active_only) items = items.filter(f => f.is_active)
      return paginate(items, filters.page, filters.per_page)
    },
    get: (id: string) => MOCK_FACILITIES.find(f => f.id === id) ?? null,
  },
  campaigns: {
    list: (filters: { status?: string; page?: number; per_page?: number } = {}) => {
      let items = [...MOCK_CAMPAIGNS]
      if (filters.status) items = items.filter(c => c.status === filters.status)
      return paginate(items, filters.page, filters.per_page)
    },
    get: (id: string) => MOCK_CAMPAIGNS.find(c => c.id === id) ?? null,
  },
  patients: {
    list: (filters: { campaign_id?: string; facility_id?: string; gender?: string; search?: string; page?: number; per_page?: number } = {}) => {
      let items = [...MOCK_PATIENTS]
      if (filters.campaign_id) items = items.filter(p => p.campaign_id === filters.campaign_id)
      if (filters.facility_id) items = items.filter(p => p.facility?.id === filters.facility_id)
      if (filters.gender) items = items.filter(p => p.gender === filters.gender)
      if (filters.search) {
        const q = filters.search.toLowerCase()
        items = items.filter(p =>
          p.last_name.toLowerCase().includes(q) ||
          p.first_name?.toLowerCase().includes(q) ||
          p.patient_code.toLowerCase().includes(q)
        )
      }
      return paginate(items, filters.page, filters.per_page)
    },
    get: (id: string) => MOCK_PATIENTS.find(p => p.id === id) ?? null,
    encounters: (id: string) => MOCK_ENCOUNTERS.filter(e => e.patient_id === id),
  },
  encounters: {
    list: (filters: { campaign_id?: string; patient_id?: string; status?: string; page?: number; per_page?: number } = {}) => {
      let items = [...MOCK_ENCOUNTERS]
      if (filters.campaign_id) items = items.filter(e => e.campaign_id === filters.campaign_id)
      if (filters.patient_id) items = items.filter(e => e.patient_id === filters.patient_id)
      if (filters.status) items = items.filter(e => e.status === filters.status)
      return paginate(items, filters.page, filters.per_page)
    },
    get: (id: string) => {
      const encounter = MOCK_ENCOUNTERS.find(e => e.id === id) ?? null
      if (!encounter) return null
      return { ...encounter, exams: MOCK_EXAMS.filter(ex => ex.encounter_id === id) }
    },
  },
  exams: {
    list: (filters: { encounter_id?: string; status?: string; page?: number; per_page?: number } = {}) => {
      let items = [...MOCK_EXAMS]
      if (filters.encounter_id) items = items.filter(e => e.encounter_id === filters.encounter_id)
      if (filters.status) items = items.filter(e => e.status === filters.status)
      return paginate(items, filters.page, filters.per_page)
    },
    get: (id: string) => MOCK_EXAMS.find(e => e.id === id) ?? null,
    measurements: (id: string) => MOCK_MEASUREMENTS.filter(m => m.exam_id === id),
  },
  devices: {
    list: (filters: { facility_id?: string; status?: string; type?: string; page?: number; per_page?: number } = {}) => {
      let items = [...MOCK_DEVICES]
      if (filters.facility_id) items = items.filter(d => d.facility_id === filters.facility_id)
      if (filters.status) items = items.filter(d => d.status === filters.status)
      if (filters.type) items = items.filter(d => d.type === filters.type)
      return paginate(items, filters.page, filters.per_page)
    },
    get: (id: string) => MOCK_DEVICES.find(d => d.id === id) ?? null,
  },
  users: {
    list: (filters: { role?: string; facility_id?: string; is_active?: boolean; page?: number; per_page?: number } = {}) => {
      let items = [...MOCK_USERS]
      if (filters.role) items = items.filter(u => u.role === filters.role)
      if (filters.facility_id) items = items.filter(u => u.facility_id === filters.facility_id)
      if (filters.is_active !== undefined) items = items.filter(u => u.is_active === filters.is_active)
      return paginate(items, filters.page, filters.per_page)
    },
    get: (id: string) => MOCK_USERS.find(u => u.id === id) ?? null,
  },
}
