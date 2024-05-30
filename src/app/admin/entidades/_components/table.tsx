'use client'

import { api } from '@/trpc/react'

import { DataTable } from '@/components/ui/data-table'

import { getColumns } from './constants'
import { DataTableToolbar } from './toolbar'

export default function EntitiesAdminTable() {
  const [entities, { refetch }] = api.entity.getAll.useSuspenseQuery()
  const columns = getColumns({ refetchEntities: refetch })

  if (!entities) return null
  return (
    <DataTable
      data={entities}
      columns={columns}
      pageSize={10}
      toolbar={DataTableToolbar}
      subject="Entidades"
      refetchFn={() => {}}
    />
  )
}
