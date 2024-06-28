'use client'

import { api } from '@/trpc/react'

import type { Company } from '@/types/siac'
import { DataTable } from '@/components/ui/data-table'
import { useDinamicPageSize } from '@/app/_utils/table'

import { getColumns } from './constants'
import { DataTableToolbar } from './toolbar'

export default function AdminTable() {
  const { data, isPending, refetch } = api.company.getAll.useQuery()
  const columns = getColumns({ refetch })

  const pageSize = useDinamicPageSize({
    rowHeight: 48,
    isAdmin: true,
  })

  return (
    <DataTable
      data={data || ([] as Company[])}
      columns={columns}
      toolbar={DataTableToolbar}
      subject="construtoras"
      refetchFn={refetch}
      isLoading={isPending}
      pageSize={pageSize}
    />
  )
}
