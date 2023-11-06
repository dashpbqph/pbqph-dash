import { ReactNode } from 'react'

import { AdminSidebar } from '@/components/shared/admin'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 shrink-0 flex-col gap-3 sm:flex-row">
      <AdminSidebar />
      <div className="flex flex-1 flex-col gap-6 rounded-md bg-white p-4 text-primary">
        {children}
      </div>
    </div>
  )
}
