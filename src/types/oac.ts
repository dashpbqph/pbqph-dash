import { RouterOutputs } from '@/trpc/shared'

export type OAC = Awaited<RouterOutputs['oac']['getAll'][number]>
