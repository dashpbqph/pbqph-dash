import { RouterOutputs } from '@/server/api/root'

export type ProjectWithRelations = Awaited<RouterOutputs['project']['getAll'][number]>
