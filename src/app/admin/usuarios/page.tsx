import { Users } from 'lucide-react'

import { AdminUsersTable } from '@/components/feature/tables/admin'

export default function AdminUsers() {
  return (
    <>
      <div className="item flex items-center gap-4">
        <Users className="h-6 w-6" />
        <span className="text-2xl font-semibold">
          Administração de Usuários
        </span>
      </div>
      <AdminUsersTable />
    </>
  )
}
