'use client'

import { api } from '@/trpc/react'

import { Entity } from '@/types/entity'
import { DataTable } from '@/components/ui/data-table'

import { getColumns } from './constants'
import { DataTableToolbar } from './toolbar'

export default function EntitiesAdminTable() {
  const { data: entities, isPending, refetch } = api.entity.getAll.useQuery()
  const columns = getColumns({ refetchEntities: refetch })

  return (
    <DataTable
      data={entities || ([] as Entity[])}
      columns={columns}
      pageSize={10}
      toolbar={DataTableToolbar}
      subject="Entidades"
      refetchFn={refetch}
      isLoading={isPending}
    />
  )
}
