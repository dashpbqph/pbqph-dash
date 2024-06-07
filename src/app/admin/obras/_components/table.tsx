'use client'

import { api } from '@/trpc/react'

import { ProjectWithRelations } from '@/types/project'
import { DataTable } from '@/components/ui/data-table'
import { useDinamicPageSize } from '@/app/_utils/table'

import { getColumns } from './constants'
import { DataTableToolbar } from './toolbar'

export default function ProjectsTable() {
  const { data: projects, isPending, refetch } = api.project.getAll.useQuery()
  const columns = getColumns({ refetchProjects: refetch })

  const pageSize = useDinamicPageSize({
    rowHeight: 48,
    isAdmin: true,
  })

  return (
    <DataTable
      data={projects || ([] as ProjectWithRelations[])}
      columns={columns}
      toolbar={DataTableToolbar}
      subject="obras"
      refetchFn={refetch}
      isLoading={isPending}
      pageSize={pageSize}
    />
  )
}
