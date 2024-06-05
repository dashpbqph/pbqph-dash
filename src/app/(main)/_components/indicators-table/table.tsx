'use client'

import { useRouter } from 'next/navigation'
import { api } from '@/trpc/react'
import { type Row } from '@tanstack/react-table'

import { IndicatorWithRelations } from '@/types/indicator'
import { DataTable } from '@/components/ui/data-table'
import SkeletonTable from '@/components/ui/skeleton/skeleton-table'
import { toast } from '@/components/ui/use-toast'

import { columns } from './constants'
import { Legend } from './legend'
import { DataTableToolbar } from './toolbar'

export default function IndicatorsTable() {
  const { data: indicators, error } = api.indicator.getAll.useQuery()
  const router = useRouter()

  if (!indicators) return <SkeletonTable />
  if (error) {
    toast({
      title: 'Erro ao carregar indicadores',
      description: 'Ocorreu um erro ao carregar os indicadores, tente novamente mais tarde.',
      status: 'error',
    })
    return null
  }

  function handleRowClick(row: Row<IndicatorWithRelations>) {
    router.push(`/indicador/${row.original.id}`)
  }

  return (
    <DataTable
      data={indicators || []}
      columns={columns}
      toolbar={DataTableToolbar}
      pageSize={4}
      rowClickFn={handleRowClick}
      subject="indicadores"
      fullSize
      paginationVariant="dark"
      legendComponent={Legend}
      border={false}
    />
  )
}
