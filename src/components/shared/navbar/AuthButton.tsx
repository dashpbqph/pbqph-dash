import { getServerAuthSession } from '@/server/auth'

import { LoginButton, UserButton } from '@/components/feature/auth'

export default async function AuthButton() {
  const session = await getServerAuthSession()
  return session?.user ? <UserButton user={session.user} /> : <LoginButton />
}
