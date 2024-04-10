import { Suspense } from 'react'

import { IndicatorsTable } from '@/components/dashboard/tables'
import SkeletonTable from '@/components/shared/DataTable/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function Home() {
  return (
    <Card className="flex w-full flex-1 rounded-md bg-white">
      <CardContent className="w-full py-4">
        <Suspense fallback={<SkeletonTable />}>
          <IndicatorsTable />
        </Suspense>
      </CardContent>
    </Card>
  )
}
