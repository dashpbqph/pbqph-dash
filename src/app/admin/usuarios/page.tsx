import { Suspense } from 'react'

import SkeletonTable from '@/components/ui/skeleton/skeleton-table'
import AdminPageHeader from '@/app/admin/_components/page-header'

import UsersAdminTable from './_components/table'

export default function AdminUsers() {
  return (
    <>
      <AdminPageHeader title="Usuários" />
      <Suspense fallback={<SkeletonTable hasCreateButton />}>
        <UsersAdminTable />
      </Suspense>
    </>
  )
}
