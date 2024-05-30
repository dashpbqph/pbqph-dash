import { Suspense } from 'react'

import SkeletonTable from '@/components/ui/skeleton/skeleton-table'
import AdminPageHeader from '@/app/admin/_components/page-header'

import ProjectsAdminTable from './_components/table'

export default function AdminIndicator() {
  return (
    <>
      <AdminPageHeader title="Obras" />
      <Suspense fallback={<SkeletonTable hasCreateButton />}>
        <ProjectsAdminTable />
      </Suspense>
    </>
  )
}
