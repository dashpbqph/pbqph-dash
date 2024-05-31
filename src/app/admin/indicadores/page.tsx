import { Suspense } from 'react'

import SkeletonTable from '@/components/ui/skeleton/skeleton-table'
import AdminPageHeader from '@/app/admin/_components/page-header'

import IndicatorsAdminTable from './_components/table'

export default function AdminIndicator() {
  return (
    <>
      <AdminPageHeader title="Indicadores" />
      <Suspense fallback={<SkeletonTable hasCreateButton />}>
        <IndicatorsAdminTable />
      </Suspense>
    </>
  )
}
