'use client'

import { api } from '@/trpc/react'
import { ColumnDef } from '@tanstack/react-table'

import DataTable from '@/components/admin/DataTable'
import { getColumns } from './CompaniesTable.constants'
import { DataTableToolbar } from './CompaniesToolbar'

export default function IndicatorsTable() {
  const { data, refetch } = api.company.getAll.useQuery()
  const columns = getColumns({ refetchCompanies: refetch })

  return (
    data && (
      <DataTable
        data={data}
        columns={columns as ColumnDef<(typeof data)[number], typeof columns>[]}
        toolbar={DataTableToolbar}
        subject="construtora"
        refetchFn={refetch}
      />
    )
  )
}
