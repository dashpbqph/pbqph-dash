'use client'

import { useRouter } from 'next/navigation'
import { api } from '@/trpc/react'
import { ColumnDef, type Row } from '@tanstack/react-table'

import DataTable from '@/components/shared/DataTable'
import { columns } from './IndicatorsTable.constants'
import { DataTableToolbar } from './IndicatorsToolbar'

export default function IndicatorsTable() {
  const [indicators] = api.indicator.getAllWithRelations.useSuspenseQuery()
  const router = useRouter()

  if (!indicators) return null
  return (
    <DataTable
      data={indicators}
      columns={
        columns as ColumnDef<(typeof indicators)[number], typeof columns>[]
      }
      toolbar={DataTableToolbar}
      pageSize={5}
      rowClickFn={(row: Row<(typeof indicators)[number]>) => {
        router.push(`/detalhes?id=${row.original.id}`)
      }}
      subject="indicadores"
    />
  )
}
