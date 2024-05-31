import { PropsWithChildren } from 'react'
import { createCaller } from '@/server/api/root'
import { getServerAuthSession } from '@/server/auth'
import { db } from '@/server/db'

import AdminSidebar from './_components/sidebar'

export default async function AdminLayout({ children }: PropsWithChildren) {
  const session = await getServerAuthSession()
  if (!session) return null

  const server = createCaller({ headers: new Headers(), db, session })

  try {
    const user = await server.user.getUserByUsername({
      username: session.user.username,
    })

    return (
      <div className="flex w-full flex-1 shrink-0 flex-col gap-3 sm:flex-row">
        <AdminSidebar user={user} />
        <div className="flex flex-1 flex-col gap-4 rounded-md bg-white px-6 py-5 text-primary sm:gap-7">
          {children}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching user', error)
    return null
  }
}
