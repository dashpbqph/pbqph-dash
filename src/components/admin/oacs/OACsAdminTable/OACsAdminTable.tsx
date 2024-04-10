'use client'

import { api } from '@/trpc/react'

import DataTable from '@/components/shared/DataTable'
import { getColumns } from './OACsAdminTable.constants'
import { DataTableToolbar } from './OACsAdminToolbar'

export default function OACsAdminTable() {
  const [oacs, { refetch }] = api.oac.getAll.useSuspenseQuery()
  const columns = getColumns({ refetchOACs: refetch })

  if (!oacs) return null
  return (
    <DataTable
      data={oacs}
      columns={columns}
      toolbar={DataTableToolbar}
      subject="OACs"
      refetchFn={refetch}
    />
  )
}
