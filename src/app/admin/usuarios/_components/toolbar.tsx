'use client'

import { Table } from '@tanstack/react-table'

import { Input } from '@/components/ui/input'

import UserCreateUpdateDialog from './dialog/create-update'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  refetchFn: () => void
}

export function DataTableToolbar<TData>({ table, refetchFn }: DataTableToolbarProps<TData>) {
  const search = table.getColumn('name')

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    search?.setFilterValue(event.target.value)
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <Input
        placeholder="Buscar por nome..."
        value={(search?.getFilterValue() as string) || ''}
        onChange={handleSearch}
        className="h-8 flex-1 sm:w-[300px] sm:flex-none lg:w-[500px]"
      />
      <UserCreateUpdateDialog refetchUsers={refetchFn} />
    </div>
  )
}
