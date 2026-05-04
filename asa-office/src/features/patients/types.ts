import { z } from 'zod'

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const

export const patientSchema = z.object({
  last_name:    z.string().min(1, 'Nom requis'),
  first_name:   z.string().optional(),
  birth_date:   z.string().optional(),
  gender:       z.enum(['male', 'female']).optional(),
  blood_type:   z.enum(BLOOD_TYPES).optional(),
  phone:        z.string().max(20).optional(),
  height_cm:    z.number().min(50).max(250).optional(),
  weight_kg:    z.number().min(1).max(500).optional(),
  campaign_id:  z.string().optional(),
  facility_id:  z.string().optional(),
  patient_code: z.string().optional(),
})

export type PatientInput = z.infer<typeof patientSchema>
