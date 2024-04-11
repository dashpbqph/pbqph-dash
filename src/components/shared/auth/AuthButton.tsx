import { getServerAuthSession } from '@/server/auth'
import { api } from '@/trpc/server'

import { LoginButton, UserButton } from '@/components/shared/auth'

export default async function AuthButton() {
  console.log('vercel url', process.env.VERCEL_URL)
  console.log('db url', process.env.DATABASE_URL)
  try {
    const session = await getServerAuthSession()
    console.log('session', session)
    const user = session
      ? await api.user.getUserByUsername.query({
          username: 'super.admin',
        })
      : null
    console.log('user', user)
    return user ? <UserButton user={user} /> : <LoginButton />
  } catch (error) {
    console.error(error)
    return <LoginButton />
  }
}
