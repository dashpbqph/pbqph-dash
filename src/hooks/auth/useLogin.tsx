import { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function useLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const login = async (credentials: { username: string; password: string }) => {
    try {
      setIsLoading(true)

      const response = await signIn('credentials', {
        ...credentials,
        redirect: false,
      }).finally(() => setIsLoading(false))

      if (response?.error === 'Invalid Credentials') {
        setErrorMessage('Usuário ou senha incorretos')
        return false
      }

      if (response?.error) {
        setErrorMessage('Erro ao fazer login. Tente novamente mais tarde.')
        return false
      }
    } catch (error) {
      setIsLoading(false)
      setErrorMessage('Erro ao fazer login. Tente novamente mais tarde.')
      return false
    }

    return true
  }

  return { isLoading, login, errorMessage }
}
