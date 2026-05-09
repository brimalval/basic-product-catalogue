import { z } from 'zod'

export const enquirySchema = z.object({
  productId: z.number().int().positive(),
  productTitle: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
})
