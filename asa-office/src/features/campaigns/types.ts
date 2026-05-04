import { z } from 'zod'

export const campaignSchema = z.object({
  name:               z.string().min(2, 'Nom requis'),
  description:        z.string().optional(),
  code:               z.string().max(50).optional(),
  objective_type:     z.enum(['screening', 'consultation', 'vaccination', 'follow_up', 'other']),
  target_pathologies: z.array(z.string()).optional(),
  starts_at:          z.string().min(1, 'Date de début requise'),
  ends_at:            z.string().min(1, 'Date de fin requise'),
  quota_per_day:      z.number().int().min(1, 'Quota journalier requis (min 1)'),
  quota_per_site:     z.number().int().min(1, 'Quota par site requis (min 1)'),
  quota_total:        z.number().int().min(1).optional(),
  protocol_exam_ids:  z.array(z.number()).optional(),
})

export type CampaignInput = z.infer<typeof campaignSchema>
