import { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function useLogin() {
  const [isLoading, setIsLoading] = useState(false)

  const login = async (credentials: { username: string; password: string }) => {
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
    } catch (error) {
      setIsLoading(false)
      return {
        ok: false,
        error: 'Erro ao fazer login. Tente novamente mais tarde.',
      }
    }

    setIsLoading(false)
    return { ok: true }
  }

  return { isLoading, login }
}
