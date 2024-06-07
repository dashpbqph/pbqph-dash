'use client'

import { api } from '@/trpc/react'

import { Entity } from '@/types/entity'
import { DataTable } from '@/components/ui/data-table'
import { useDinamicPageSize } from '@/app/_utils/table'

import { getColumns } from './constants'
import { DataTableToolbar } from './toolbar'

export default function EntitiesAdminTable() {
  const { data: entities, isPending, refetch } = api.entity.getAll.useQuery()
  const columns = getColumns({ refetchEntities: refetch })

  const pageSize = useDinamicPageSize({
    rowHeight: 48,
    isAdmin: true,
  })

  return (
    <DataTable
      data={entities || ([] as Entity[])}
      columns={columns}
      pageSize={pageSize}
      toolbar={DataTableToolbar}
      subject="Entidades"
      refetchFn={refetch}
      isLoading={isPending}
    />
  )
}
