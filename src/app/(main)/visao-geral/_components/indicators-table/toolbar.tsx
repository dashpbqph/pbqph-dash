'use client'

import { Category, SystemAbbrev } from '@prisma/client'
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
  const isFiltered = table.getState().columnFilters.length > 0
  const system = table.getColumn('system')?.getFilterValue()?.toString() as SystemAbbrev
  const category = table.getColumn('category')?.getFilterValue()?.toString() as Category
  const hasGroup = system === SystemAbbrev.SiAC && category === Category.RESULTADO

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
          />
        )}
        {table.getColumn('category') && (
          <DataTableFacetedFilter
            column={table.getColumn('category')}
            title="Categoria"
            options={CATEGORY_OPTIONS}
          />
        )}
        {hasGroup && (
          <DataTableFacetedFilter
            column={table.getColumn('group')}
            title="Agrupamento"
            options={GROUP_OPTIONS}
          />
        )}
        {isFiltered && (
          <Button
            variant="destructive"
            onClick={() => table.resetColumnFilters()}
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
