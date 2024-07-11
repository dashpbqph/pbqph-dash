'use client'

import { useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Category, SystemAbbrev, UserRole } from '@prisma/client'
import { Table } from '@tanstack/react-table'
import { XIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import { DataTableFacetedFilter } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { CATEGORY_OPTIONS, SYSTEM_OPTIONS } from '@/app/constants'

import IndicatorCreateUpdateDialog from './dialog/create-update'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  refetchFn: () => void
}

export function DataTableToolbar<TData>({ table, refetchFn }: DataTableToolbarProps<TData>) {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const system = searchParams.get('s') as SystemAbbrev | null
  const category = searchParams.get('c') as Category | null

  useEffect(() => {
    if (system) table.getColumn('system')?.setFilterValue(system)
    if (category) table.getColumn('category')?.setFilterValue(category)
  }, [table, system, category])

  const isFiltered = Boolean(system || category)

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex flex-1 flex-col gap-3 md:flex-none md:flex-row md:gap-2">
        <Input
          placeholder="Buscar por código ou nome..."
          value={(table.getColumn('code')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('code')?.setFilterValue(event.target.value)}
          className="h-8 w-full lg:w-[250px]"
        />
        <div className="flex gap-2">
          {session?.user.role === UserRole.ADMIN && (
            <>
              {table.getColumn('system') && (
                <DataTableFacetedFilter
                  column={table.getColumn('system')}
                  title="Sistema"
                  options={SYSTEM_OPTIONS}
                  queryParam="s"
                  className="border"
                />
              )}
              {table.getColumn('category') && (
                <DataTableFacetedFilter
                  column={table.getColumn('category')}
                  title="Categoria"
                  options={CATEGORY_OPTIONS}
                  queryParam="c"
                  className="border"
                />
              )}
              {isFiltered && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    table.resetColumnFilters()
                    router.replace(pathname)
                  }}
                  className="h-8 px-2 lg:px-3"
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      {session?.user.role === UserRole.ADMIN && (
        <IndicatorCreateUpdateDialog refetchIndicators={refetchFn} />
      )}
    </div>
  )
}
