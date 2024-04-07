import { RouterOutputs } from '@/trpc/shared'

export type IndicatorWithValues = Awaited<
  RouterOutputs['indicator']['getIndicatorById']
>

export type IndicatorWithRelations = Awaited<
  RouterOutputs['indicator']['getAllWithRelations'][number]
>

export type IndicatorValuesWithRelation = Awaited<
  RouterOutputs['indicator']['getValuesByIndicatorId'][number]
>

export type IndicatorValue = Omit<
  Awaited<RouterOutputs['indicator']['getValuesByIndicatorId'][number]>,
  'indicator'
>

export type Tab = 'basic' | 'formula' | 'stratification'
