'use client'

import { Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  refetchFn: () => void
}

export function DataTableToolbar<TData>({
  table,
  refetchFn,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <Input
        placeholder="Buscar por código..."
        value={(table.getColumn('code')?.getFilterValue() as string) ?? ''}
        onChange={(event) =>
          table.getColumn('code')?.setFilterValue(event.target.value)
        }
        className="h-8 w-[150px] lg:w-[250px]"
      />
      <Button variant="outline">Novo Indicador</Button>
    </div>
  )
}
