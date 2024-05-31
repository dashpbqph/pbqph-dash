import { createCaller } from '@/server/api/root'
import { getServerAuthSession } from '@/server/auth'
import { db } from '@/server/db'

import { LoginButton } from './login-button'
import UserButton from './user-button'

export default async function AuthButton() {
  const session = await getServerAuthSession()
  if (!session) return <LoginButton />

  const server = createCaller({ headers: new Headers(), db, session })

  try {
    const user = await server.user.getUserByUsername({
      username: session.user.username,
    })

    return <UserButton user={user} />
  } catch (error) {
    console.error('Error fetching user', error)
    return <LoginButton />
  }
}
