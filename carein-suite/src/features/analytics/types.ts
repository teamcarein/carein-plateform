export interface BoPatientCount {
  code:  string
  name:  string
  count: number
}

export interface MonthlyCount {
  month: string
  count: number
}

export interface AnalyticsOverview {
  total_bos:             number
  total_tenants:         number
  total_patients:        number
  consultations_30d:     number
  pending_invitations:   number
  patients_by_bo:        BoPatientCount[]
  monthly_consultations: MonthlyCount[]
}
