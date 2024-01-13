'use client'

import { api } from '@/trpc/react'
import { ColumnDef } from '@tanstack/react-table'

import DataTable from '@/components/admin/DataTable'
import { getColumns } from './ProjectsTable.constants'
import { DataTableToolbar } from './ProjectsToolbar'

export default function IndicatorsTable() {
  const { data, refetch } = api.project.getAll.useQuery()
  const columns = getColumns({ refetchProjects: refetch })

  return (
    data && (
      <DataTable
        data={data}
        columns={columns as ColumnDef<(typeof data)[number], typeof columns>[]}
        toolbar={DataTableToolbar}
        subject="obra"
        refetchFn={refetch}
      />
    )
  )
}
