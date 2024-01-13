'use client'

import { Table } from '@tanstack/react-table'

import { UserCreateButton } from '@/components/admin/users'
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
    <div className="flex items-center justify-between gap-3">
      <Input
        placeholder="Buscar por nome..."
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onChange={(event) =>
          table.getColumn('name')?.setFilterValue(event.target.value)
        }
        className="h-9 flex-1 sm:h-8 sm:w-[150px] lg:w-[250px]"
      />
      <UserCreateButton refetchUsers={refetchFn} />
    </div>
  )
}
