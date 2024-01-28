'use client'

import { api } from '@/trpc/react'

import DataTable from '@/components/shared/DataTable'
import { getColumns } from './ProjectsAdminTable.constants'
import { DataTableToolbar } from './ProjectsAdminToolbar'

export default function ProjectsTable() {
  const [projects, { refetch }] =
    api.project.getAllWithRelations.useSuspenseQuery()
  const columns = getColumns({ refetchProjects: refetch })

  if (!projects) return null
  return (
    <DataTable
      data={projects}
      columns={columns}
      toolbar={DataTableToolbar}
      subject="obras"
      refetchFn={refetch}
    />
  )
}
