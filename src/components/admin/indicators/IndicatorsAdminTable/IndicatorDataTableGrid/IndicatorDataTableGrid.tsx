'use client'

import { useEffect, useState } from 'react'
import { api } from '@/trpc/react'

import DataTable from '@/components/shared/DataTable'
import {
  IndicatorValuesWithRelation,
  IndicatorWithRelations,
} from '@/types/indicator'
import { getColumns } from './IndicatorDataTableGrid.constants'
import { useDataTableToolbar } from './IndicatorDataTableGridToolbar'

type IndicatorDataTableGridProps = {
  indicator: IndicatorWithRelations
  indicatorValues: IndicatorValuesWithRelation[]
  setIndicatorValues: (values: IndicatorValuesWithRelation[]) => void
}

export default function IndicatorDataTableGrid({
  indicator,
  indicatorValues,
  setIndicatorValues,
}: IndicatorDataTableGridProps) {
  const [defaultIndicatorValues, { refetch }] =
    api.indicator.getValuesByIndicatorId.useSuspenseQuery({ id: indicator.id })
  const [idEditValues, setIdEditValues] = useState<string[]>([])
  const [idDeleteValues, setIdDeleteValues] = useState<string[]>([])

  useEffect(
    () => setIndicatorValues(defaultIndicatorValues),
    [defaultIndicatorValues, setIndicatorValues],
  )

  const columns = getColumns({
    idEditValues,
    setIdEditValues,
    indicatorValues,
    setIndicatorValues,
    idDeleteValues,
    setIdDeleteValues,
    refetchIndicators: refetch,
  })

  const { DataTableToolbar } = useDataTableToolbar({
    indicator,
    indicatorValues,
    setIndicatorValues,
    idEditValues,
    setIdEditValues,
  })

  return (
    <DataTable
      data={indicatorValues}
      columns={columns}
      toolbar={DataTableToolbar}
      pageSize={7}
      subject="valores"
    />
  )
}
