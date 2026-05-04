export type CampaignObjectiveType = 'screening' | 'consultation' | 'vaccination' | 'follow_up' | 'other'
export type CampaignStatus = 'draft' | 'planned' | 'active' | 'paused' | 'completed' | 'cancelled'

export type Campaign = {
  id: string
  name: string
  description?: string
  code?: string
  objective_type: CampaignObjectiveType
  target_pathologies?: string[]
  status: CampaignStatus
  quota_per_day: number
  quota_per_site: number
  quota_total?: number
  starts_at: string
  ends_at: string
  launched_at?: string
  organization?: { id: string; name: string; type: string }
  sites?: unknown[]
  protocols?: unknown[]
}

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'

export type Patient = {
  id: string
  patient_code: string
  first_name?: string
  last_name: string
  birth_date?: string
  gender?: 'male' | 'female'
  blood_type?: BloodType
  phone?: string
  height_cm?: number
  weight_kg?: number
  bmi?: number
  campaign_id?: string
  facility_id?: string
  facility?: { id: string; name: string }
  created_at: string
}

export type EncounterStatus =
  | 'draft'
  | 'in_progress'
  | 'awaiting_review'
  | 'under_review'
  | 'needs_info'
  | 'validated'
  | 'cancelled'

export type EncounterType = 'in_person' | 'teleconsultation' | 'campaign_visit'

export type ExamCategory =
  | 'cardio_metabolic'
  | 'general'
  | 'ophtalmo'
  | 'dental'
  | 'mental_health'
  | 'gynecology'

export type Encounter = {
  id: string
  patient_id: string
  doctor_id?: string
  campaign_id?: string
  facility_id?: string
  type: EncounterType
  status: EncounterStatus
  started_at: string
  ended_at?: string
  notes?: string
  risk_score?: number
  patient?: Pick<Patient, 'id' | 'patient_code' | 'first_name' | 'last_name'>
  facility?: { id: string; name: string }
  exams?: Exam[]
}

export type Exam = {
  id: string
  encounter_id: string
  category: ExamCategory
  status: 'pending' | 'in_progress' | 'completed'
  risk_score?: number
  notes?: string
  started_at: string
  completed_at?: string
  measurements?: Measurement[]
}

export type Measurement = {
  id: string
  exam_id: string
  device_id?: string
  type: string
  value: Record<string, unknown>
  unit: string
  is_abnormal: boolean
  measured_at: string
}

export type DeviceType =
  | 'blood_pressure'
  | 'pulse_oximeter'
  | 'ecg'
  | 'glucometer'
  | 'scale'
  | 'thermometer'
  | 'spirometer'
  | 'other'

export type Device = {
  id: string
  facility_id: string
  serial: string
  name: string
  type: DeviceType
  protocol: 'usb' | 'bluetooth' | 'network'
  status: 'active' | 'inactive' | 'maintenance'
  last_seen_at?: string
  facility?: { id: string; name: string }
}

export type Facility = {
  id: string
  name: string
  code?: string
  address?: string
  city?: string
  country?: string
  is_active: boolean
  users_count?: number
  created_at: string
}

export type UserRole = 'admin' | 'supervisor' | 'nurse' | 'technician' | 'agent'

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  facility_id?: string
  facility?: { id: string; name: string }
  phone?: string
  is_active: boolean
  last_login_at?: string
  created_at: string
}

export type PaginatedResponse<T> = {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export type AuthUser = {
  id: string
  name: string
  email: string
  role: string
  permissions: string[]
  facility_id?: number | null
}

export type ApiError = {
  message: string
  errors?: Record<string, string[]>
}

export type ActivityPoint = {
  date: string
  patients: number
  encounters: number
}

export type RecentActivity = {
  id: string
  type: 'campaign' | 'patient' | 'encounter'
  description: string
  created_at: string
}
