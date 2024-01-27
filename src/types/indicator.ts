import { RouterOutputs } from '@/trpc/shared'

export type IndicatorWithRelations = Awaited<
  RouterOutputs['indicator']['getAllWithRelations'][number]
>

export type Tab = 'basic' | 'formula' | 'stratification'
