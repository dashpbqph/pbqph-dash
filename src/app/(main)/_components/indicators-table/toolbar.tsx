'use client'

import { Category } from '@prisma/client'
import { Table } from '@tanstack/react-table'
import { XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DataTableFacetedFilter } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'

// TODO: filter values from database

export const systems = [
  {
    value: 'SiAC',
    label: 'SiAC',
  },
  {
    value: 'SiMaC',
    label: 'SiMaC',
  },
  {
    value: 'SiNAT',
    label: 'SiNAT',
  },
]

export const categories = [
  {
    value: Category.ESTRATEGICO,
    label: 'Estratégico',
  },
  {
    value: Category.DESEMPENHO,
    label: 'Desempenho',
  },
  {
    value: Category.RESULTADO,
    label: 'Resultado',
  },
]

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  refetchFn?: () => void
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

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
            options={systems}
          />
        )}
        {table.getColumn('category') && (
          <DataTableFacetedFilter
            column={table.getColumn('category')}
            title="Categoria"
            options={categories}
          />
        )}
        {isFiltered && (
          <Button
            variant="destructive"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            <span className="hidden sm:block">Limpar filtros</span>
            <XIcon className="h-4 w-4 sm:ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}
