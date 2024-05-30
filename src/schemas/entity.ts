import { z } from 'zod'

export const entityCreateFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
    .max(100, { message: 'O nome deve ter no máximo 100 caracteres.' }),
  type: z
    .string()
    .min(2, { message: 'O tipo deve ter no mínimo 2 caracteres.' })
    .max(100, { message: 'O tipo deve ter no máximo 100 caracteres.' }),
})
