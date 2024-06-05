import getAuthData from '@/app/_utils/auth'

import LoginButton from './login-button'
import UserButton from './user-button'

export default async function AuthButton() {
  const { isLoggedIn, user } = await getAuthData()

  if (!isLoggedIn || !user) return <LoginButton />

  return <UserButton user={user} />
}
