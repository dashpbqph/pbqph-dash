'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/trpc/react'
import { type Row } from '@tanstack/react-table'

import { IndicatorWithRelations } from '@/types/indicator'
import { DataTable } from '@/components/ui/data-table'
import SkeletonTable from '@/components/ui/skeleton/skeleton-table'
import { toast } from '@/components/ui/use-toast'
import { useDinamicPageSize } from '@/app/_utils/table'

import { columns } from './constants'
import { Legend } from './legend'
import { DataTableToolbar } from './toolbar'

export default function IndicatorsTable() {
  const searchParams = useSearchParams()
  const pageIndex = searchParams.get('p')
  const { data: indicators, error } = api.indicator.getAll.useQuery()
  const router = useRouter()

  const pageSize = useDinamicPageSize({
    rowHeight: 108,
  })

  if (!indicators) return <SkeletonTable />
  if (error) {
    toast({
      title: 'Erro ao carregar indicadores',
      description: 'Ocorreu um erro ao carregar os indicadores, tente novamente mais tarde.',
      status: 'error',
    })
    return null
  }

  function handleRowClick({
    row,
    pageIndex,
  }: {
    row: Row<IndicatorWithRelations>
    pageIndex: number
  }) {
    const params = new URLSearchParams({
      fp: pageIndex.toString(),
    })
    router.push(`/indicador/${row.original.id}?${params.toString()}`)
  }

  return (
    <DataTable
      data={indicators || []}
      columns={columns}
      toolbar={DataTableToolbar}
      pageSize={pageSize}
      rowClickFn={handleRowClick}
      subject="indicadores"
      fullSize
      paginationVariant="dark"
      legendComponent={Legend}
      border={false}
      pageIndex={Number(pageIndex) || undefined}
    />
  )
}
