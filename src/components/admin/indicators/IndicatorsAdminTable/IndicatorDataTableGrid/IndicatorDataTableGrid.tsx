import { useState } from 'react'
import { api } from '@/trpc/react'

import DataTable from '@/components/shared/DataTable'
import { IndicatorWithRelations } from '@/types/indicator'
import { getColumns } from './IndicatorDataTableGrid.constants'
import { DataTableToolbar } from './IndicatorDataTableGridToolbar'

type IndicatorDataTableGridProps = {
  indicator: IndicatorWithRelations
  onSubmit: () => void
}

export default function IndicatorDataTableGrid({
  indicator,
  onSubmit,
}: IndicatorDataTableGridProps) {
  const [indicatorValues, { refetch }] =
    api.indicator.getValuesByIndicatorId.useSuspenseQuery({ id: indicator?.id })
  const [idEditValues, setIdEditValues] = useState<string[]>([])
  const columns = getColumns({
    idEditValues,
    setIdEditValues,
    refetchIndicators: refetch,
  })

  return (
    <DataTable
      data={indicatorValues}
      columns={columns}
      toolbar={DataTableToolbar}
      pageSize={7}
      subject="valores"
      refetchFn={refetch}
    />
  )
}
