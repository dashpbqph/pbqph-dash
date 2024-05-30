'use client'

import { api } from '@/trpc/react'

import { DataTable } from '@/components/ui/data-table'

import { getColumns } from './constants'
import { DataTableToolbar } from './toolbar'

export default function IndicatorsAdminTable() {
  const [indicators, { refetch }] = api.indicator.getAllWithRelations.useSuspenseQuery()
  const columns = getColumns({ refetchIndicators: refetch })

  if (!indicators) return null
  return (
    <DataTable
      data={indicators}
      columns={columns}
      toolbar={DataTableToolbar}
      pageSize={9}
      subject="indicadores"
      refetchFn={refetch}
    />
  )
}
