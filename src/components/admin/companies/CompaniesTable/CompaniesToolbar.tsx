'use client'

import { Table } from '@tanstack/react-table'
import { Building, Plus } from 'lucide-react'

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
    <div className="flex items-center justify-between gap-3">
      <Input
        placeholder="Buscar por nome..."
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onChange={(event) =>
          table.getColumn('name')?.setFilterValue(event.target.value)
        }
        className="h-9 w-[150px] flex-1 sm:h-8 lg:w-[250px]"
      />
      <Button variant="outline">
        <div className="relative">
          <Building className="h-5 w-5 sm:hidden" />
          <Plus className="absolute -right-[3px] top-[11px] h-3 w-3 rounded-full bg-white sm:hidden" />
        </div>
        <span className="hidden sm:block">Nova Construtora</span>
      </Button>
    </div>
  )
}
