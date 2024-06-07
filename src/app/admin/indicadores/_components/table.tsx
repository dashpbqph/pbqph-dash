'use client'

import { api } from '@/trpc/react'

import { IndicatorWithRelations } from '@/types/indicator'
import { DataTable } from '@/components/ui/data-table'
import { useDinamicPageSize } from '@/app/_utils/table'

import { getColumns } from './constants'
import { DataTableToolbar } from './toolbar'

export default function IndicatorsAdminTable() {
  const { data: indicators, isPending, refetch } = api.indicator.getAll.useQuery()
  const columns = getColumns({ refetchIndicators: refetch })

  const pageSize = useDinamicPageSize({
    rowHeight: 48,
    isAdmin: true,
  })

  return (
    <DataTable
      data={indicators || ([] as IndicatorWithRelations[])}
      columns={columns}
      toolbar={DataTableToolbar}
      pageSize={pageSize}
      subject="indicadores"
      refetchFn={refetch}
      isLoading={isPending}
    />
  )
}
