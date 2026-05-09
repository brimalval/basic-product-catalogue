import { z } from 'zod'

export const searchQuerySchema = z.object({
  q: z.string().min(1, 'Query required'),
})

export const productIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const categoryParamSchema = z.object({
  category: z.string().min(1),
})

export const scopeQuerySchema = z.object({
  scope: z.string().default('global'),
})
