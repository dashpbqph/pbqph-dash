'use client'

import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { DataTableFacetedFilter } from '@/components/shared/DataTable/data-table-faceted-filter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IndicatorCreateUpdateDialog } from './dialog'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  refetchFn: () => void
}

const systems = [
  {
    value: 'SiAC',
    label: 'SiAC',
  },
]

const categories = [
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

export function DataTableToolbar<TData>({
  table,
  refetchFn,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex flex-1 flex-col gap-3 md:flex-none md:flex-row md:gap-2">
        <Input
          placeholder="Buscar por código ou nome..."
          value={(table.getColumn('code')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('code')?.setFilterValue(event.target.value)
          }
          className="h-9 w-full lg:w-[250px]"
        />
        <div className="flex gap-2">
          {table.getColumn('system') && (
            <DataTableFacetedFilter
              className="h-9"
              column={table.getColumn('system')}
              title="Sistema"
              options={systems}
            />
          )}
          {table.getColumn('category') && (
            <DataTableFacetedFilter
              className="h-9"
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
      <IndicatorCreateUpdateDialog refetchIndicators={refetchFn} />
    </div>
  )
}
