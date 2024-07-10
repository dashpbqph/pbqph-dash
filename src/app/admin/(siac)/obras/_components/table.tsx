'use client'

import { api } from '@/trpc/react'
import { useSession } from 'next-auth/react'

import { ProjectWithRelations } from '@/types/siac'
import { DataTable } from '@/components/ui/data-table'
import { useDinamicPageSize } from '@/app/_utils/table'

import { getColumns } from './constants'
import { DataTableToolbar } from './toolbar'

export default function ProjectsTable() {
  const { data: session } = useSession()
  const { data, isPending, refetch } = api.project.getAll.useQuery({
    company: session?.user.company,
  })
  const columns = getColumns({ refetch })

  const pageSize = useDinamicPageSize({
    rowHeight: 48,
    isAdmin: true,
  })

  return (
    <DataTable
      data={data || ([] as ProjectWithRelations[])}
      columns={columns}
      toolbar={DataTableToolbar}
      subject="obras"
      refetchFn={refetch}
      isLoading={isPending}
      pageSize={pageSize}
    />
  )
}
