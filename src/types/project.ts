import { RouterOutputs } from '@/trpc/shared'

export type ProjectWithRelations = Awaited<
  RouterOutputs['project']['getAllWithRelations'][number]
>
