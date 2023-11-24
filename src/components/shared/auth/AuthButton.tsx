import { getServerAuthSession } from '@/server/auth'
import { api } from '@/trpc/server'

import { LoginButton, UserButton } from '@/components/shared/auth'

export default async function AuthButton() {
  let user = null

  try {
    const session = await getServerAuthSession()
    user = session
      ? await api.user.getUserByUsername.query({
          username: session.user.username,
        })
      : null
  } catch (error) {
    throw new Error('Erro ao buscar usuário')
  }

  return user ? <UserButton user={user} /> : <LoginButton />
}
