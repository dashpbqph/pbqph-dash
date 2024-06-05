'use client'

import { api } from '@/trpc/react'

import { IndicatorWithRelations } from '@/types/indicator'
import { DataTable } from '@/components/ui/data-table'

import { getColumns } from './constants'
import { DataTableToolbar } from './toolbar'

export default function IndicatorsAdminTable() {
  const { data: indicators, isPending, refetch } = api.indicator.getAll.useQuery()
  const columns = getColumns({ refetchIndicators: refetch })

  return (
    <DataTable
      data={indicators || ([] as IndicatorWithRelations[])}
      columns={columns}
      toolbar={DataTableToolbar}
      pageSize={9}
      subject="indicadores"
      refetchFn={refetch}
      isLoading={isPending}
    />
  )
}
