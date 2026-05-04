import { z } from 'zod'

export const deviceSchema = z.object({
  facility_id: z.string().uuid(),
  serial:      z.string().min(1, 'Numéro de série requis'),
  name:        z.string().min(1, 'Nom requis'),
  type:        z.enum(['blood_pressure', 'pulse_oximeter', 'ecg', 'glucometer', 'scale', 'thermometer', 'spirometer', 'other']),
  protocol:    z.enum(['usb', 'bluetooth', 'network']),
})

export type DeviceInput = z.infer<typeof deviceSchema>
