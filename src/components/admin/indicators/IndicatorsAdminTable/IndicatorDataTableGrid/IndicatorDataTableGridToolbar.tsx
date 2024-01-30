'use client'

import { Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  refetchFn: () => void
}

export function DataTableToolbar<TData>({
  table,
  refetchFn,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-end gap-3">
      <Button variant="outline">Nova medição</Button>
    </div>
  )
}
