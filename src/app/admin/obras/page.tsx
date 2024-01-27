import { Suspense } from 'react'
import { BrickWall } from 'lucide-react'

import { AdminPageHeader } from '@/components/admin'
import { ProjectsAdminTable } from '@/components/admin/projects'
import SkeletonTable from '@/components/shared/DataTable/skeleton'

export default function AdminIndicator() {
  return (
    <>
      <AdminPageHeader title="Administração de Obras" icon={BrickWall} />
      <Suspense fallback={<SkeletonTable hasCreateButton />}>
        <ProjectsAdminTable />
      </Suspense>
    </>
  )
}
