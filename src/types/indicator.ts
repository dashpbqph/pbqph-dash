import { RouterOutputs } from '@/server/api/root'

export type IndicatorWithValues = Awaited<RouterOutputs['indicator']['getIndicatorById']>

export type IndicatorWithRelations = Awaited<RouterOutputs['indicator']['getAll'][number]>

export type IndicatorValuesWithRelation = Awaited<
  RouterOutputs['indicator']['getValuesByIndicatorId'][number]
>

export type IndicatorValue = Omit<
  Awaited<RouterOutputs['indicator']['getValuesByIndicatorId'][number]>,
  'indicator'
>

export type Tab = 'infos' | 'properties' | 'stratifications'
