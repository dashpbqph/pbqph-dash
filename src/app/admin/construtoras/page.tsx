import { Suspense } from 'react'
import { Building } from 'lucide-react'

import { AdminPageHeader } from '@/components/admin'
import { CompaniesAdminTable } from '@/components/admin/companies'
import SkeletonTable from '@/components/shared/DataTable/skeleton'

export default function AdminIndicator() {
  return (
    <>
      <AdminPageHeader title="Administração de Construtoras" icon={Building} />
      <Suspense fallback={<SkeletonTable hasCreateButton />}>
        <CompaniesAdminTable />
      </Suspense>
    </>
  )
}
