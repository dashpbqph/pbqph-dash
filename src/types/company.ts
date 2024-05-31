import { RouterOutputs } from '@/server/api/root'

export type Company = Awaited<RouterOutputs['company']['getAll'][number]>
