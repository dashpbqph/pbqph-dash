'use client'

import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { DataTableFacetedFilter } from '@/components/shared/DataTable/data-table-faceted-filter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// TODO: filter values from database

export const systems = [
  {
    value: 'SiAC',
    label: 'SiAC',
  },
]

export const categories = [
  {
    value: 'Estratégico',
    label: 'Estratégico',
  },
  {
    value: 'Desempenho',
    label: 'Desempenho',
  },
  {
    value: 'Resultado',
    label: 'Resultado',
  },
]

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  refetchFn?: () => void
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
      <Input
        placeholder="Buscar por código..."
        value={(table.getColumn('code')?.getFilterValue() as string) ?? ''}
        onChange={(event) =>
          table.getColumn('code')?.setFilterValue(event.target.value)
        }
        className="h-8 w-full flex-1 sm:flex-none lg:w-[250px]"
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
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            <span className="hidden sm:block">Limpar filtros</span>
            <Cross2Icon className="h-4 w-4 sm:ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}
