'use client'

import { api } from '@/trpc/react'

import { UserEnriched } from '@/types/user'
import { DataTable } from '@/components/ui/data-table'
import { useDinamicPageSize } from '@/app/_utils/table'

import { getColumns } from './constants'
import { DataTableToolbar } from './toolbar'

export default function UsersAdminTable() {
  const { data: users, isPending, refetch } = api.user.getAll.useQuery()
  const columns = getColumns({ refetchUsers: refetch })

  const pageSize = useDinamicPageSize({
    rowHeight: 48,
    isAdmin: true,
  })

  return (
    <DataTable
      data={users || ([] as UserEnriched[])}
      columns={columns}
      toolbar={DataTableToolbar}
      subject="usuários"
      refetchFn={refetch}
      isLoading={isPending}
      pageSize={pageSize}
    />
  )
}
