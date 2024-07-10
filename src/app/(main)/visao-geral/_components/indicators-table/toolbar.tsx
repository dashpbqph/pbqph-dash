'use client'

import { useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Category, Group, SystemAbbrev } from '@prisma/client'
import { Table } from '@tanstack/react-table'
import { XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DataTableFacetedFilter } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { CATEGORY_OPTIONS, GROUP_OPTIONS, SYSTEM_OPTIONS } from '@/app/constants'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const system = searchParams.get('s') as SystemAbbrev | null
  const category = searchParams.get('c') as Category | null
  const group = searchParams.get('g') as Group | null

  useEffect(() => {
    if (system) table.getColumn('system')?.setFilterValue(system)
    if (category) table.getColumn('category')?.setFilterValue(category)
    if (group) table.getColumn('group')?.setFilterValue(group)
  }, [table, system, category, group])

  const hasGroup = system === SystemAbbrev.SiAC && category === Category.RESULTADO
  const isFiltered = Boolean(system || category || group)

  return (
    <div className="flex flex-col gap-3 md:flex-row md:gap-2">
      <Input
        placeholder="Buscar por código ou nome..."
        value={(table.getColumn('description')?.getFilterValue() as string) ?? ''}
        onChange={(event) => table.getColumn('description')?.setFilterValue(event.target.value)}
        className="h-8 w-full flex-1 sm:flex-none md:w-[320px]"
      />
      <div className="flex gap-2">
        {table.getColumn('system') && (
          <DataTableFacetedFilter
            column={table.getColumn('system')}
            title="Sistema"
            options={SYSTEM_OPTIONS}
            queryParam="s"
          />
        )}
        {table.getColumn('category') && (
          <DataTableFacetedFilter
            column={table.getColumn('category')}
            title="Categoria"
            options={CATEGORY_OPTIONS}
            queryParam="c"
          />
        )}
        {hasGroup && (
          <DataTableFacetedFilter
            column={table.getColumn('group')}
            title="Agrupamento"
            options={GROUP_OPTIONS}
            queryParam="g"
          />
        )}
        {isFiltered && (
          <Button
            variant="destructive"
            onClick={() => {
              table.resetColumnFilters()
              router.replace(pathname)
            }}
            className="group h-8 px-2 lg:px-3"
            data-group={hasGroup}
          >
            <span className="hidden group-data-[group=true]:hidden sm:block">Limpar filtros</span>
            <XIcon className="h-4 w-4 group-data-[group=false]:sm:ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}
