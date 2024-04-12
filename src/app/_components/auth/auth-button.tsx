import { getServerAuthSession } from '@/server/auth'
import { api } from '@/trpc/server'

import { LoginButton } from './login-button'
import { UserButton } from './user-button'

export default async function AuthButton() {
  try {
    const session = await getServerAuthSession()
    const user = session
      ? await api.user.getUserByUsername({
          username: 'super.admin',
        })
      : null

    return user ? <UserButton user={user} /> : <LoginButton />
  } catch (error) {
    console.error(error)
    return <LoginButton />
  }
}
