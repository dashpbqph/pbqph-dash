import { Suspense } from 'react'

import SkeletonTable from '@/components/ui/skeleton/skeleton-table'
import AdminPageHeader from '@/app/admin/_components/page-header'

import EntitiesAdminTable from './_components/table'

export default function AdminEntity() {
  return (
    <>
      <AdminPageHeader title="Entidades" />
      <Suspense fallback={<SkeletonTable hasCreateButton />}>
        <EntitiesAdminTable />
      </Suspense>
    </>
  )
}
