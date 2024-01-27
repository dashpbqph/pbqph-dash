'use client'

import { api } from '@/trpc/react'
import { ColumnDef } from '@tanstack/react-table'

import DataTable from '@/components/shared/DataTable'
import { getColumns } from './IndicatorsAdminTable.constants'
import { DataTableToolbar } from './IndicatorsAdminToolbar'

export default function IndicatorsAdminTable() {
  const [indicators, { refetch }] =
    api.indicator.getAllWithRelations.useSuspenseQuery()
  const columns = getColumns({ refetchIndicators: refetch })

  if (!indicators) return null
  return (
    <DataTable
      data={indicators}
      columns={
        columns as ColumnDef<(typeof indicators)[number], typeof columns>[]
      }
      toolbar={DataTableToolbar}
      pageSize={7}
      subject="indicadores"
      refetchFn={refetch}
    />
  )
}
