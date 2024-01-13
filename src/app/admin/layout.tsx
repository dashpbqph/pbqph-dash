import { ReactNode } from 'react'

import { AdminSidebar } from '@/components/admin'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 shrink-0 flex-col gap-3 sm:flex-row">
      <AdminSidebar />
      <div className="flex flex-1 flex-col gap-4 rounded-md bg-white px-6 py-5 text-primary  sm:gap-7">
        {children}
      </div>
    </div>
  )
}
