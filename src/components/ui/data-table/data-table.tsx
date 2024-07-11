import { ElementType, useState } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
  type Row,
} from '@tanstack/react-table'

import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { DataTablePagination } from './pagination'

function getValidPageIndex(maxPageIndex: number, pageIndex?: number) {
  if (!pageIndex || pageIndex < 0) return 0
  if (pageIndex > maxPageIndex) return maxPageIndex

  return pageIndex
}

interface DataTableProps<TData, TValue> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  toolbar: ElementType
  pageSize?: number
  pageIndex?: number
  subject: string
  rowClickFn?: ({ row, pageIndex }: { row: Row<TData>; pageIndex: number }) => void
  refetchFn?: () => void
  isLoading?: boolean
  fullSize?: boolean
  columnVisibilityDefault?: VisibilityState
  paginationVariant?: 'light' | 'dark'
  legendComponent?: ElementType
  border?: boolean
}

export default function DataTable<TData, TValue>({
  data,
  columns,
  toolbar: Toolbar,
  pageSize = 9,
  pageIndex,
  subject,
  rowClickFn,
  refetchFn,
  isLoading = false,
  fullSize = false,
  columnVisibilityDefault = {},
  paginationVariant = 'light',
  legendComponent: LegendComponent,
  border = true,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState(columnVisibilityDefault)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const maxPageIndex = Math.ceil(data.length / pageSize) - 1
  const [pageIndexInternal, setPageIndexInternal] = useState(
    getValidPageIndex(maxPageIndex, pageIndex),
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex: pageIndexInternal,
        pageSize,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="space-y-3">
      <Toolbar table={table} refetchFn={refetchFn} />
      <div className={cn('overflow-hidden rounded-md', border && 'border')}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-primary">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="relative">
            {LegendComponent && table.getRowModel().rows?.length ? <LegendComponent /> : null}
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={
                    rowClickFn ? () => rowClickFn({ row, pageIndex: pageIndexInternal }) : undefined
                  }
                  data-clickable={!!rowClickFn}
                  className="bg-white data-[clickable=true]:cursor-pointer data-[odd=true]:bg-background/95 data-[odd=true]:hover:bg-muted/80"
                  data-odd={index % 2 === 1}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'text-secondary',
                        fullSize
                          ? 'data-[last=true]:w-[300px] data-[last=true]:xl:w-[360px]'
                          : 'data-[last=true]:w-14',
                        cell.column.id === 'name' && subject === 'usuários' && 'pl-2',
                      )}
                      data-last={index === row.getAllCells().length - 1}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className={cn('h-24 bg-white text-center')}>
                  {isLoading ? 'Carregando...' : 'Nenhum registro encontrado.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        table={table}
        subject={subject}
        variant={paginationVariant}
        pageIndex={pageIndexInternal}
        setPageIndex={setPageIndexInternal}
      />
    </div>
  )
}
