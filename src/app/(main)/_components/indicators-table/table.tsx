'use client'

import { useRouter } from 'next/navigation'
import { api } from '@/trpc/react'
import { ColumnDef, type Row } from '@tanstack/react-table'

import { DataTable } from '@/components/ui/data-table'

import { columns } from './constants'
import { Legend } from './legend'
import { DataTableToolbar } from './toolbar'

export default function IndicatorsTable() {
  const [indicators] = api.indicator.getAllWithRelations.useSuspenseQuery()
  const router = useRouter()

  if (!indicators) return null
  return (
    <DataTable
      data={indicators}
      columns={columns as ColumnDef<(typeof indicators)[number], typeof columns>[]}
      toolbar={DataTableToolbar}
      pageSize={4}
      rowClickFn={(row: Row<(typeof indicators)[number]>) => {
        router.push(`/indicador/${row.original.id}`)
      }}
      subject="indicadores"
      fullSize
      paginationVariant="dark"
      legendComponent={Legend}
      border={false}
    />
  )
}
