'use client'

import { api } from '@/trpc/react'

import { ProjectWithRelations } from '@/types/project'
import { DataTable } from '@/components/ui/data-table'

import { getColumns } from './constants'
import { DataTableToolbar } from './toolbar'

export default function ProjectsTable() {
  const { data: projects, isPending, refetch } = api.project.getAll.useQuery()
  const columns = getColumns({ refetchProjects: refetch })

  return (
    <DataTable
      data={projects || ([] as ProjectWithRelations[])}
      columns={columns}
      toolbar={DataTableToolbar}
      subject="obras"
      refetchFn={refetch}
      isLoading={isPending}
    />
  )
}
