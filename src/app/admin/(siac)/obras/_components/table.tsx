'use client'

import { api } from '@/trpc/react'

import { ProjectWithRelations } from '@/types/siac'
import { DataTable } from '@/components/ui/data-table'
import { useDinamicPageSize } from '@/app/_utils/table'

import { getColumns } from './constants'
import { DataTableToolbar } from './toolbar'

export default function ProjectsTable() {
  const { data, isPending, refetch } = api.project.getAll.useQuery()
  const columns = getColumns({ refetch })

  const pageSize = useDinamicPageSize({
    rowHeight: 48,
    isAdmin: true,
  })

  return (
    <DataTable
      data={data || ([] as ProjectWithRelations[])}
      columns={columns}
      toolbar={DataTableToolbar}
      subject="obras"
      refetchFn={refetch}
      isLoading={isPending}
      pageSize={pageSize}
    />
  )
}
