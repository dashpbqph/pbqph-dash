'use client'

import { api } from '@/trpc/react'

import { ITA } from '@/types/sinat'
import { DataTable } from '@/components/ui/data-table'
import { useDinamicPageSize } from '@/app/_utils/table'

import { getColumns } from './constants'
import { DataTableToolbar } from './toolbar'

export default function AdminTable() {
  const { data, isPending, refetch } = api.ita.getAll.useQuery()
  const columns = getColumns({ refetch })

  const pageSize = useDinamicPageSize({
    rowHeight: 48,
    isAdmin: true,
  })

  return (
    <DataTable
      data={data || ([] as ITA[])}
      columns={columns}
      pageSize={pageSize}
      toolbar={DataTableToolbar}
      subject="instituições"
      refetchFn={refetch}
      isLoading={isPending}
    />
  )
}
