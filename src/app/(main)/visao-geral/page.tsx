import { Card, CardContent } from '@/components/ui/card'

import IndicatorsTable from './_components/indicators-table'

export default function Overview() {
  return (
    <Card className="flex w-full flex-1 rounded-md bg-secondary">
      <CardContent className="w-full p-4">
        <IndicatorsTable />
      </CardContent>
    </Card>
  )
}
