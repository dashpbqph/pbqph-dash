'use client'

import { api } from '@/trpc/react'

import { DataTable } from '@/components/ui/data-table'

import { getColumns } from './constants'
import { DataTableToolbar } from './toolbar'

export default function CompaniesAdminTable() {
  const [companies, { refetch }] = api.company.getAll.useSuspenseQuery()
  const columns = getColumns({ refetchCompanies: refetch })

  if (!companies) return null
  return (
    <DataTable
      data={companies}
      columns={columns}
      toolbar={DataTableToolbar}
      subject="construtoras"
      refetchFn={refetch}
    />
  )
}
