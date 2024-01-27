import {
  userCreateUpdateFormSchema,
  userCreateUpdateFormSchemaOptionalPassword,
} from '@/schemas/user'
import { RouterOutputs } from '@/trpc/shared'
import { z } from 'zod'

export type User = Awaited<RouterOutputs['user']['getAll'][number]>

export type UserCreateUpdateFormSchemaUnion =
  | z.infer<typeof userCreateUpdateFormSchemaOptionalPassword>
  | z.infer<typeof userCreateUpdateFormSchema>
