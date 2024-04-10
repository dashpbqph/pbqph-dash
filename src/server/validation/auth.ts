import { z } from 'zod'

export const usernameSchema = z
  .string()
  .min(3, 'O nome de usuário deve ter pelo menos 3 caracteres')
  .max(30, 'O nome de usuário deve ter no máximo 30 caracteres')
  .superRefine((v, ctx) => {
    if (!/^[a-zA-Z0-9.]+$/.test(v)) {
      ctx.addIssue({
        code: 'custom',
        message: 'O nome de usuário só pode conter letras, números e pontos.',
      })
    }
    if (v.startsWith('.')) {
      ctx.addIssue({
        code: 'custom',
        message: 'O nome de usuário não pode começar com um ponto',
      })
    }
    return true
  })

export const optionalPasswordSchema = z
  .string()
  .max(50, 'A senha deve ter no máximo 50 caracteres')
  .superRefine((v, ctx) => {
    if (v.length === 0) return true // continue using the actual password
    if (!/[a-z]/.test(v)) {
      ctx.addIssue({
        code: 'custom',
        message: 'A senha deve conter pelo menos uma letra minúscula',
      })
    }
    if (!/[A-Z]/.test(v)) {
      ctx.addIssue({
        code: 'custom',
        message: 'A senha deve conter pelo menos uma letra maiúscula',
      })
    }
    if (!/[0-9]/.test(v)) {
      ctx.addIssue({
        code: 'custom',
        message: 'A senha deve conter pelo menos um número',
      })
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(v)) {
      ctx.addIssue({
        code: 'custom',
        message: 'A senha deve conter pelo menos um caractere especial',
      })
    }
    return true
  })

export const passwordSchema = z
  .string()
  .min(8, 'A senha deve ter pelo menos 8 caracteres')
  .max(50, 'A senha deve ter no máximo 50 caracteres')
  .superRefine((v, ctx) => {
    if (!/[a-z]/.test(v)) {
      ctx.addIssue({
        code: 'custom',
        message: 'A senha deve conter pelo menos uma letra minúscula',
      })
    }
    if (!/[A-Z]/.test(v)) {
      ctx.addIssue({
        code: 'custom',
        message: 'A senha deve conter pelo menos uma letra maiúscula',
      })
    }
    if (!/[0-9]/.test(v)) {
      ctx.addIssue({
        code: 'custom',
        message: 'A senha deve conter pelo menos um número',
      })
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(v)) {
      ctx.addIssue({
        code: 'custom',
        message: 'A senha deve conter pelo menos um caractere especial',
      })
    }
    return true
  })

export const signupSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  email: z.string().email(),
})
export type SignupSchema = z.infer<typeof signupSchema>

export const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
})
export type LoginSchema = z.infer<typeof loginSchema>
