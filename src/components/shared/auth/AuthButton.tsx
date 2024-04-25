import { getServerAuthSession } from '@/server/auth'
import { api } from '@/trpc/server'

import { LoginButton, UserButton } from '@/components/shared/auth'

export default async function AuthButton() {
  try {
    const session = await getServerAuthSession()

    if (!session) throw new Error('No session')

    const user = await api.user.getUserByUsername.query({
      username: session.user.username,
    })

    return <UserButton user={user} />
  } catch (error) {
    if ((error as Error)?.message !== 'No session') {
      console.error(error)
    }
    return <LoginButton />
  }
}
