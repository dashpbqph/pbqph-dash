import { Table } from '@tanstack/react-table'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  subject: string
  variant: 'light' | 'dark'
  pageIndex: number
  setPageIndex: (index: number) => void
}

export function DataTablePagination<TData>({
  table,
  subject,
  variant,
  pageIndex,
  setPageIndex,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="group flex items-center justify-between pl-0.5" data-dark={variant === 'dark'}>
      <div className="flex-1 text-sm font-light text-muted group-data-[dark=false]:text-black/60">
        {table.getPaginationRowModel().rows.length} de {table.getFilteredRowModel().rows.length}{' '}
        {subject}.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex w-fit items-center justify-center text-sm font-light text-muted group-data-[dark=false]:text-black/60">
          Página {table.getState().pagination.pageIndex + 1} de{' '}
          {table.getPageCount() !== 0 ? table.getPageCount() : 1}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 hover:border-accent hover:bg-accent lg:flex"
            onClick={() => setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Ir para primeira página</span>
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 hover:border-accent hover:bg-accent"
            onClick={() => setPageIndex(pageIndex - 1)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Ir para página anterior</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 hover:border-accent hover:bg-accent"
            onClick={() => setPageIndex(pageIndex + 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Ir para próxima página</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 hover:border-accent hover:bg-accent lg:flex"
            onClick={() => setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Ir para última página</span>
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
