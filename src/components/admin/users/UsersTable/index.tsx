'use client'

import { api } from '@/trpc/react'
import { ColumnDef } from '@tanstack/react-table'

import DataTable from '@/components/admin/DataTable'
import { DataTablePagination } from './UsersPagination'
import { getColumns } from './UsersTable.constants'
import { DataTableToolbar } from './UsersToolbar'

export default function UsersTable() {
  const { data, refetch } = api.user.getAll.useQuery()
  const columns = getColumns({ refetchUsers: refetch })

  return (
    data && (
      <DataTable
        data={data}
        columns={columns as ColumnDef<(typeof data)[number], typeof columns>[]}
        toolbar={DataTableToolbar}
        pagination={DataTablePagination}
        refetchFn={refetch}
      />
    )
  )
}
