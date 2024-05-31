import { Suspense } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import SkeletonTable from '@/components/ui/skeleton/skeleton-table'

import { IndicatorsTable } from './_components/indicators-table'

export default function Home() {
  return (
    <Card className="flex w-full flex-1 rounded-md bg-secondary">
      <CardContent className="w-full p-4">
        <Suspense fallback={<SkeletonTable />}>
          <IndicatorsTable />
        </Suspense>
      </CardContent>
    </Card>
  )
}
