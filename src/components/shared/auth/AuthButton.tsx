import { getServerAuthSession } from '@/server/auth'
import { db } from '@/server/db'

import { LoginButton, UserButton } from '@/components/shared/auth'

export default async function AuthButton() {
  try {
    const session = await getServerAuthSession()

    if (!session) throw new Error('No session')

    const user = await db.user.findFirst({
      where: {
        username: session.user.username,
      },
      include: {
        role: {
          select: {
            role: true,
          },
        },
        company: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!user) throw new Error('User not found')

    return (
      <UserButton
        user={{
          avatar: user.image,
          username: user.username,
          name: user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.firstName,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role?.role,
          company: user.company?.name,
        }}
      />
    )
  } catch (error) {
    if ((error as Error)?.message !== 'No session') {
      console.error(error)
    }
    return <LoginButton />
  }
}
