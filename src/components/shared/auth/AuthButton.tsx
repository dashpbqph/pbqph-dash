import { getServerAuthSession } from '@/server/auth'
import { api } from '@/trpc/server'

import { LoginButton, UserButton } from '@/components/shared/auth'

export default async function AuthButton() {
  try {
    const session = await getServerAuthSession()
    const user = session?.user
      ? await api.user.getUserByUsername.query({
          username: session.user.username,
        })
      : null
    console.log(session, user)

    return user ? <UserButton user={user} /> : <LoginButton />
  } catch (error) {
    console.error(error)
    return <LoginButton />
  }
}
