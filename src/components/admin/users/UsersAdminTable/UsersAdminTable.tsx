'use client'

import { api } from '@/trpc/react'
import { ColumnDef } from '@tanstack/react-table'

import DataTable from '@/components/shared/DataTable'
import { getColumns } from './UsersAdminTable.constants'
import { DataTableToolbar } from './UsersAdminToolbar'

export default function UsersAdminTable() {
  const [users, { refetch }] = api.user.getAll.useSuspenseQuery()
  const columns = getColumns({ refetchUsers: refetch })

  if (!users) return null
  return (
    <DataTable
      data={users}
      columns={columns as ColumnDef<(typeof users)[number], typeof columns>[]}
      toolbar={DataTableToolbar}
      subject="usuários"
      refetchFn={refetch}
    />
  )
}
