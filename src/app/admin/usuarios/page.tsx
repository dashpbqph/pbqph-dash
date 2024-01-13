import { Users } from 'lucide-react'

import { UsersTable } from '@/components/admin/users'

export default function AdminUsers() {
  return (
    <>
      <div className="item flex items-start gap-4">
        <Users className="h-6 w-6" />
        <span className="text-2xl font-semibold leading-none">
          Administração de Usuários
        </span>
      </div>
      <UsersTable />
    </>
  )
}
