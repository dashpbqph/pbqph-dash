import { createCaller } from '@/server/api/root'
import { getServerAuthSession } from '@/server/auth'
import { db } from '@/server/db'

export default async function getAuthData() {
  const session = await getServerAuthSession()
  if (!session) return { isLoggedIn: false }

  const server = createCaller({ headers: new Headers(), db, session })

  try {
    const user = await server.user.getUserByUsername({
      username: session.user.username,
    })

    if (!user) return { isLoggedIn: false }

    return { isLoggedIn: true, user }
  } catch (error) {
    console.log(error)
    return { isLoggedIn: false }
  }
}
