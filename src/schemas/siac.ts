import { z } from 'zod'

// Company
export const companyCreateFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
    .max(100, { message: 'O nome deve ter no máximo 100 caracteres.' }),
})

// Project
export const projectCreateFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
    .max(100, { message: 'O nome deve ter no máximo 100 caracteres.' }),
  company: z.string().min(1, { message: 'Selecione uma construtora.' }),
})

// OAC
export const oacCreateFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
    .max(100, { message: 'O nome deve ter no máximo 100 caracteres.' }),
})
