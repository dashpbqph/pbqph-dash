import { getServerAuthSession } from '@/server/auth'
import { api } from '@/trpc/server'

import { LoginButton, UserButton } from '@/components/shared/navbar'

export default async function AuthButton() {
  const session = await getServerAuthSession()
  const user = session
    ? await api.user.getUserByUsername.query({
        username: session.user.username,
      })
    : null
  return user ? <UserButton user={user} /> : <LoginButton />
}
