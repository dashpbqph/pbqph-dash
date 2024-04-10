import { getServerAuthSession } from '@/server/auth'
import { api } from '@/trpc/server'

import { LoginButton, UserButton } from '@/components/shared/auth'
import { UserByUsername } from '@/types/user'

async function getUserFromDBWithRetry(
  username: string,
  retryCount = 0,
): Promise<UserByUsername | null> {
  const MAX_RETRIES = 3
  const RETRY_TIMEOUT = 1000 // 1 second
  try {
    return await api.user.getUserByUsername.query({ username })
  } catch (error) {
    if (retryCount >= MAX_RETRIES) return null
    console.error(`Failed to get user from DB. Retrying...`)

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getUserFromDBWithRetry(username, retryCount + 1))
      }, RETRY_TIMEOUT)
    })
  }
}

export default async function AuthButton() {
  const session = await getServerAuthSession()
  const user = session
    ? await getUserFromDBWithRetry(session.user.username)
    : null
  return user ? <UserButton user={user} /> : <LoginButton />
}
