import getAuthData from '@/app/_utils/auth'

import AdminSidebar from './_components/sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, user } = await getAuthData()

  if (!isLoggedIn || !user) return null
  return (
    <div className="flex w-full flex-1 shrink-0 flex-col gap-3 sm:flex-row">
      <AdminSidebar user={user} />
      <div className="flex flex-1 flex-col gap-4 rounded-md bg-white px-6 py-5 text-primary sm:gap-7">
        {children}
      </div>
    </div>
  )
}
