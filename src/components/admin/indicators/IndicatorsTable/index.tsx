'use client'

import { api } from '@/trpc/react'
import { ColumnDef } from '@tanstack/react-table'

import DataTable from '@/components/admin/DataTable'
import { getColumns } from './IndicatorsTable.constants'
import { DataTableToolbar } from './IndicatorsToolbar'

export default function IndicatorsTable() {
  const { data, refetch } = api.indicator.getAll.useQuery()
  const columns = getColumns({ refetchIndicators: refetch })

  return (
    data && (
      <DataTable
        data={data}
        columns={columns as ColumnDef<(typeof data)[number], typeof columns>[]}
        toolbar={DataTableToolbar}
        subject="indicador"
        refetchFn={refetch}
      />
    )
  )
}
