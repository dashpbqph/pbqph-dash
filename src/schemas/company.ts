import { z } from 'zod'

export const companyCreateFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
    .max(100, { message: 'O nome deve ter no máximo 100 caracteres.' }),
  description: z
    .string()
    .max(300, { message: 'A descrição deve ter no máximo 300 caracteres.' }),
})
