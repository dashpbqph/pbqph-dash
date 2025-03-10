'use client'

import { Table } from '@tanstack/react-table'

import { Input } from '@/components/ui/input'

import CreateUpdateDialog from './dialog/create-update'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  refetchFn: () => void
}

export function DataTableToolbar<TData>({ table, refetchFn }: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Input
        placeholder="Buscar por nome..."
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
        className="h-8 flex-1 sm:w-[300px] sm:flex-none lg:w-[600px]"
      />
      <CreateUpdateDialog refetch={refetchFn} />
    </div>
  )
}
