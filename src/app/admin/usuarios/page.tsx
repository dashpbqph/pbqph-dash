import { Suspense } from 'react'
import { Users } from 'lucide-react'

import { AdminPageHeader } from '@/components/admin'
import { UsersAdminTable } from '@/components/admin/users'
import SkeletonTable from '@/components/shared/DataTable/skeleton'

export default function AdminUsers() {
  return (
    <>
      <AdminPageHeader title="Administração de Usuários" icon={Users} />
      <Suspense fallback={<SkeletonTable hasCreateButton />}>
        <UsersAdminTable />
      </Suspense>
    </>
  )
}
