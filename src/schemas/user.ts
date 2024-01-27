import { passwordSchema, usernameSchema } from '@/server/validation/auth'
import { UserRole } from '@prisma/client'
import { z } from 'zod'

export const userCreateUpdateFormSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  firstName: z
    .string()
    .min(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
    .max(100, { message: 'O nome deve ter no máximo 100 caracteres.' })
    .regex(/^[a-zA-Z]+$/, {
      message: 'O nome só pode ter letras, sem espaços.',
    }),
  lastName: z
    .string()
    .max(100, { message: 'O sobrenome deve ter no máximo 100 caracteres.' })
    .regex(/^[a-zA-Z]*$/, {
      message: 'O sobrenome só pode ter letras, sem espaços.',
    }),
  email: z.string().email({ message: 'Email inválido.' }),
  image: z.instanceof(File),
  userHasCompany: z.boolean(),
  companyId: z.string(),
  role: z.nativeEnum(UserRole),
})

export const userCreateUpdateFormSchemaOptionalPassword =
  userCreateUpdateFormSchema.extend({
    password: z.string().optional(),
  })
