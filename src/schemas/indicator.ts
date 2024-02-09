import { z } from 'zod'

export const indicatorCreateUpdateFormSchema = z.object({
  // basic
  code: z
    .string()
    .min(2, { message: 'O código deve ter no mínimo 2 caracteres.' })
    .max(30, { message: 'O código deve ter no máximo 30 caracteres.' }),
  system: z.string().min(1, { message: 'Selecione um sistema.' }),
  category: z.string().min(1, { message: 'Selecione uma categoria.' }),
  name: z
    .string()
    .min(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
    .max(300, { message: 'O nome deve ter no máximo 300 caracteres.' }),
  polarity: z.string().min(1, { message: 'Selecione uma polaridade.' }),
  cumulative: z.boolean(),
  source: z
    .string()
    .min(2, { message: 'A fonte deve ter no mínimo 2 caracteres.' })
    .max(100, { message: 'A fonte deve ter no máximo 100 caracteres.' }),
  periodicity: z.string().min(1, { message: 'Selecione uma periodicidade.' }),
  impacts: z.array(z.record(z.string())),
  impactedAgents: z.array(z.record(z.string())),
  // formula
  equation: z
    .string()
    .min(1, { message: 'Escreva a fórmula de cálculo do indicador.' }),
  equationDescription: z
    .string()
    .min(1, { message: 'Escreva a descrição da fórmula de cálculo.' })
    .max(300, { message: 'A descrição deve ter no máximo 300 caracteres.' }),
  unit: z
    .string()
    .min(1, { message: 'Escreva a unidade de medida do indicador.' })
    .max(50, { message: 'A unidade deve ter no máximo 50 caracteres.' }),
  // stratification
  stratifiedByOAC: z.boolean(),
  stratifiedByRegion: z.boolean(),
  stratifiedByCompany: z.boolean(),
  stratifiedByProject: z.boolean(),
})

export const indicatorCRUDFormSchema = z.array(
  z.object({
    id: z.string(),
    date: z.date(),
    value: z.number(),
  }),
)
