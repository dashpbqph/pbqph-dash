import { useState } from 'react'
import { signIn } from 'next-auth/react'

type LoginResponse = {
  ok: boolean
  error?: string
}

export default function useLogin() {
  const [isLoading, setIsLoading] = useState(false)

  const login = async (credentials: {
    username: string
    password: string
  }): Promise<LoginResponse> => {
    try {
      setIsLoading(true)

      const response = await signIn('credentials', {
        ...credentials,
        redirect: false,
      })

      if (response?.error === 'Invalid Credentials') {
        setIsLoading(false)
        return { ok: false, error: 'Usuário ou senha incorretos' }
      }

      if (response?.error) {
        setIsLoading(false)
        return {
          ok: false,
          error: 'Erro ao fazer login. Tente novamente mais tarde.',
        }
      }

      setIsLoading(false)
      return { ok: true }
    } catch (error) {
      setIsLoading(false)
      return {
        ok: false,
        error: 'Erro ao fazer login. Tente novamente mais tarde.',
      }
    }
  }

  return { isLoading, login }
}
