'use client'

import { Table } from '@tanstack/react-table'
import { XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DataTableFacetedFilter } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'

import { IndicatorCreateUpdateDialog } from './dialog/create-update'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  refetchFn: () => void
}

const systems = [
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

export function DataTableToolbar<TData>({ table, refetchFn }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
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
          {table.getColumn('system') && (
            <DataTableFacetedFilter
              column={table.getColumn('system')}
              title="Sistema"
              options={systems}
              className="border"
            />
          )}
          {table.getColumn('category') && (
            <DataTableFacetedFilter
              column={table.getColumn('category')}
              title="Categoria"
              options={categories}
              className="border"
            />
          )}
          {isFiltered && (
            <Button
              variant="destructive"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <IndicatorCreateUpdateDialog refetchIndicators={refetchFn} />
    </div>
  )
}
