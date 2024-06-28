import { z } from 'zod'

import { IndicatorWithRelations } from '@/types/indicator'

export const indicatorCreateUpdateFormSchema = z.object({
  // basic
  code: z
    .string()
    .min(2, { message: 'O código deve ter no mínimo 2 caracteres.' })
    .max(30, { message: 'O código deve ter no máximo 30 caracteres.' }),
  codeMarkdown: z
    .string()
    .min(2, { message: 'O código markdown deve ter no mínimo 2 caracteres.' })
    .max(30, { message: 'O código markdown deve ter no máximo 30 caracteres.' }),
  system: z.string().min(1, { message: 'Selecione um sistema.' }),
  category: z.string().min(1, { message: 'Selecione uma categoria.' }),
  name: z
    .string()
    .min(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
    .max(300, { message: 'O nome deve ter no máximo 300 caracteres.' }),
  purpose: z
    .string()
    .min(2, { message: 'A finalidade do indicador deve ter no mínimo 2 caracteres.' })
    .max(500, { message: 'A finalidade do indicador deve ter no máximo 500 caracteres.' }),
  polarity: z.string().min(1, { message: 'Selecione uma polaridade.' }),
  cumulative: z.boolean(),
  source: z
    .string()
    .min(2, { message: 'A fonte deve ter no mínimo 2 caracteres.' })
    .max(200, { message: 'A fonte deve ter no máximo 200 caracteres.' }),
  periodicity: z.string().min(1, { message: 'Selecione uma periodicidade.' }),
  impactNatures: z.array(z.record(z.string())),
  impactedAgents: z.array(z.record(z.string())),
  // formula
  equationMarkdown: z.string().min(1, { message: 'Escreva a fórmula de cálculo do indicador.' }),
  equationVarsMarkdown: z.string().min(1, { message: 'Escreva as variáveis da fórmula.' }),
  unit: z
    .string()
    .min(1, { message: 'Escreva a unidade de medida do indicador.' })
    .max(50, { message: 'A unidade deve ter no máximo 50 caracteres.' }),
  // stratification
  stratifiedByOAC: z.boolean(),
  stratifiedByPSQ: z.boolean(),
  stratifiedByGuideline: z.boolean(),
  stratifiedByRegion: z.boolean(),
  stratifiedByCompany: z.boolean(),
  stratifiedByProject: z.boolean(),
})

const baseIndicatorCRUDFormSchema = z.object({
  id: z.string(),
  date: z.date(),
  value: z.number(),
})

export function getDynamicIndicatorCRUDFormSchema(indicator: IndicatorWithRelations) {
  const stratifications = []
  if (indicator.stratifiedByRegion) stratifications.push('region')
  if (indicator.stratifiedByCompany) stratifications.push('company')
  if (indicator.stratifiedByProject) stratifications.push('project')
  if (indicator.stratifiedByOAC) stratifications.push('oac')

  return z.array(
    baseIndicatorCRUDFormSchema.merge(
      z.object(
        stratifications.reduce((_, stratification) => {
          return {
            [stratification]: z.string(),
          }
        }, {}),
      ),
    ),
  )
}
