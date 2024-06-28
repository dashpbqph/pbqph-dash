import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'

import type { IndicatorWithRelations } from '@/types/indicator'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Markdown from '@/app/_providers/markdown-provider'

import IndicatorCreateUpdateDialog from './dialog/create-update'
import IndicatorCRUDDataDialog from './dialog/crud-data'
import IndicatorDeleteDialog from './dialog/delete-indicator'

type GetColumnsProps = {
  refetchIndicators: () => void
}

export const getColumns = ({
  refetchIndicators,
}: GetColumnsProps): ColumnDef<IndicatorWithRelations>[] => {
  return [
    {
      accessorKey: 'code',
      header: ({ column }) => {
        return (
          <div className="flex">
            <Button
              variant="ghost"
              className="flex justify-start hover:bg-transparent hover:text-accent"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Código
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => (
        <div className="min-w-[240px] px-4 font-medium">
          <Markdown>{`${row.original.codeMarkdown}`}</Markdown>
        </div>
      ),
      filterFn: (row, _id, value) => {
        const codeAndName = `${row.original.code} ${row.original.name}`
        return codeAndName.includes(value)
      },
    },
    {
      accessorKey: 'system',
      accessorFn: (row) => row.system.abbrev,
      header: () => <div className="hidden">Sistema</div>,
      cell: ({ row }) => <div className="hidden min-w-[140px]">{row.original.system.abbrev}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'category',
      accessorFn: (row) => row.category,
      header: () => <div className="hidden">Categoria</div>,
      cell: ({ row }) => <div className="hidden min-w-[140px]">{row.original.category}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'name',
      header: () => <div>Nome</div>,
      cell: ({ row }) => (
        <div className="line-clamp-2 h-10 min-w-[240px] text-left">{row.getValue('name')}</div>
      ),
    },
    {
      id: 'lastValue',
      header: () => <div className="hidden text-center lg:block">Último valor</div>,
      cell: ({ row }) => {
        const values = row.original.values
        const lastValue =
          values.length > 0 ? values.reduce((a, b) => (a.createdAt > b.createdAt ? a : b)) : null
        return (
          <div className="hidden min-w-[140px] text-center lg:block">
            {lastValue?.value.toLocaleString('pt-BR')}
          </div>
        )
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const indicator = row.original
        return (
          <div className="pr-1.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-full min-w-[30px] max-w-[48px] p-0 hover:bg-accent"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="flex flex-col gap-0.5">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <IndicatorCreateUpdateDialog
                    indicator={indicator}
                    refetchIndicators={refetchIndicators}
                  />
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <IndicatorCRUDDataDialog indicator={indicator} />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <IndicatorDeleteDialog
                    indicator={indicator}
                    refetchIndicators={refetchIndicators}
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}
