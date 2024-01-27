import { Suspense } from 'react'
import { PieChart } from 'lucide-react'

import { AdminPageHeader } from '@/components/admin'
import { IndicatorsAdminTable } from '@/components/admin/indicators'
import SkeletonTable from '@/components/shared/DataTable/skeleton'

export default function AdminIndicator() {
  return (
    <>
      <AdminPageHeader title="Administração de Indicadores" icon={PieChart} />
      <Suspense fallback={<SkeletonTable hasCreateButton />}>
        <IndicatorsAdminTable />
      </Suspense>
    </>
  )
}
