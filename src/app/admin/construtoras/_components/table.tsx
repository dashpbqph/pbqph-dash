'use client'

import { api } from '@/trpc/react'

import type { Company } from '@/types/company'
import { DataTable } from '@/components/ui/data-table'

import { getColumns } from './constants'
import { DataTableToolbar } from './toolbar'

export default function CompaniesAdminTable() {
  const { data: companies, isPending, refetch } = api.company.getAll.useQuery()
  const columns = getColumns({ refetchCompanies: refetch })

  return (
    <DataTable
      data={companies || ([] as Company[])}
      columns={columns}
      toolbar={DataTableToolbar}
      subject="construtoras"
      refetchFn={refetch}
      isLoading={isPending}
    />
  )
}
