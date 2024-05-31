'use client'

import { api } from '@/trpc/react'

import { DataTable } from '@/components/ui/data-table'

import { getColumns } from './constants'
import { DataTableToolbar } from './toolbar'

export default function UsersAdminTable() {
  const [users, { refetch }] = api.user.getAll.useSuspenseQuery()
  const columns = getColumns({ refetchUsers: refetch })

  if (!users) return null
  return (
    <DataTable
      data={users}
      columns={columns}
      toolbar={DataTableToolbar}
      subject="usuários"
      refetchFn={refetch}
    />
  )
}
