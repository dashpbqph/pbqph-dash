import { RouterOutputs } from '@/trpc/shared'

export type Company = Awaited<RouterOutputs['company']['getAll'][number]>
