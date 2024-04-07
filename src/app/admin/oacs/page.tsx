import { Suspense } from 'react'
import { Box } from 'lucide-react'

import { AdminPageHeader } from '@/components/admin'
import { OACsAdminTable } from '@/components/admin/oacs'
import SkeletonTable from '@/components/shared/DataTable/skeleton'

export default function AdminOAC() {
  return (
    <>
      <AdminPageHeader title="Administração de OACs" icon={Box} />
      <Suspense fallback={<SkeletonTable hasCreateButton />}>
        <OACsAdminTable />
      </Suspense>
    </>
  )
}
