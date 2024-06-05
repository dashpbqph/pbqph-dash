import {
  userCreateUpdateFormSchema,
  userCreateUpdateFormSchemaOptionalPassword,
} from '@/schemas/user'
import { RouterOutputs } from '@/server/api/root'
import { UserRole } from '@prisma/client'
import { z } from 'zod'

export type User = Awaited<RouterOutputs['user']['getAll'][number]>

export type UserCreateUpdateFormSchemaUnion =
  | z.infer<typeof userCreateUpdateFormSchemaOptionalPassword>
  | z.infer<typeof userCreateUpdateFormSchema>

export type UserByUsername = Awaited<RouterOutputs['user']['getUserByUsername']>

export type UserEnriched = {
  id: string
  avatar: string
  username: string
  name: string
  firstName: string
  lastName: string
  email: string
  createdAt: Date
  role: UserRole
  company: {
    id: string
    name: string
  }
}
