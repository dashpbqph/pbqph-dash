'use client'

import { useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/trpc/react'
import { UserRole } from '@prisma/client'
import { type Row } from '@tanstack/react-table'
import { useAtomValue } from 'jotai'
import { useSession } from 'next-auth/react'

import { IndicatorWithRelations } from '@/types/indicator'
import { DataTable } from '@/components/ui/data-table'
import SkeletonTable from '@/components/ui/skeleton/skeleton-table'
import { toast } from '@/components/ui/use-toast'
import { selectedCompanyAtom } from '@/app/_atoms/company'
import { useDinamicPageSize } from '@/app/_utils/table'

import { columns } from './constants'
import { DataTableToolbar } from './toolbar'

export default function IndicatorsTable() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const pageIndex = searchParams.get('p')
  const selectedCompany = useAtomValue(selectedCompanyAtom)
  const company = session?.user.role === UserRole.MEMBER ? session.user?.company : selectedCompany
  const { data: indicators, error } = api.indicator.getAllByCompany.useQuery(
    {
      company: company ?? null,
    },
    { enabled: company !== undefined },
  )
  const router = useRouter()

  const pageSize = useDinamicPageSize({
    rowHeight: 108,
  })

  const cachedColumns = useMemo(() => columns, [])

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
    if (searchParams.get('s')) {
      params.set('s', searchParams.get('s')!)
    }
    if (searchParams.get('c')) {
      params.set('c', searchParams.get('c')!)
    }
    router.push(`/indicador/${row.original.id}?${params.toString()}`)
  }

  return (
    <DataTable
      data={indicators || []}
      columns={cachedColumns}
      toolbar={DataTableToolbar}
      pageSize={pageSize}
      rowClickFn={handleRowClick}
      subject="indicadores"
      paginationVariant="dark"
      border={false}
      pageIndex={Number(pageIndex) || undefined}
    />
  )
}
