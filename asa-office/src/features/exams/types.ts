import { z } from 'zod'

export const examSchema = z.object({
  encounter_id: z.string().uuid(),
  category: z.enum(['cardio_metabolic', 'general', 'ophtalmo', 'dental', 'mental_health', 'gynecology']),
  notes: z.string().max(1000).optional(),
})

export type ExamInput = z.infer<typeof examSchema>
