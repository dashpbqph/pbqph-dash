// import { getServerAuthSession } from '@/server/auth'
// import { api } from '@/trpc/server'
import { UserRole } from '@prisma/client'

import { LoginButton, UserButton } from '@/components/shared/auth'

export default async function AuthButton() {
  try {
    // const session = await getServerAuthSession()
    // const user = await api.user.getUserByUsername.query({
    //   username: 'super.admin',
    // })
    // console.log(user)

    const fakeUser = {
      avatar: 'https://avatars.githubusercontent.com/u/3040235',
      username: 'test.user',
      name: 'Test User',
      firstName: 'Test',
      lastName: 'User',
      email: 'test.user@gmail.com',
      role: UserRole.STAFF,
      company: undefined,
    }

    return <UserButton user={fakeUser} />
  } catch (error) {
    console.error(error)
    return <LoginButton />
  }
}
