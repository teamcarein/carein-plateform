import { z } from 'zod'

export const encounterSchema = z.object({
  patient_id:  z.string().uuid(),
  campaign_id: z.string().uuid().optional(),
  facility_id: z.string().uuid().optional(),
  type:        z.enum(['in_person', 'teleconsultation', 'campaign_visit']),
  notes:       z.string().max(1000).optional(),
})

export type EncounterInput = z.infer<typeof encounterSchema>

export const examInEncounterSchema = z.object({
  encounter_id: z.string().uuid(),
  category:     z.enum(['cardio_metabolic', 'general', 'ophtalmo', 'dental', 'mental_health', 'gynecology']),
  notes:        z.string().max(1000).optional(),
})

export type ExamInEncounterInput = z.infer<typeof examInEncounterSchema>
