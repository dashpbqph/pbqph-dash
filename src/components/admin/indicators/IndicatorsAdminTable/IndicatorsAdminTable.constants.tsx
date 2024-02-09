import { ColumnDef } from '@tanstack/react-table'
import { MathJax } from 'better-react-mathjax'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { IndicatorWithRelations } from '@/types/indicator'
import {
  IndicatorCreateUpdateDialog,
  IndicatorCRUDDataDialog,
  IndicatorDeleteDialog,
} from './dialog'

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
              className="flex justify-start"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              Código
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => (
        <div className="min-w-[240px] px-4 font-medium">
          <MathJax
            hideUntilTypeset="first"
            inline
            dynamic
            suppressHydrationWarning
          >
            {`\\(${row.getValue('code')}\\)`}
          </MathJax>
        </div>
      ),
      filterFn: (row, _id, value) => {
        const codeAndName = `${row.getValue('code')} ${row.original.name}`
        return codeAndName.includes(value)
      },
    },
    {
      accessorKey: 'system',
      accessorFn: (row) => row.system.code,
      header: () => <div className="hidden">Sistema</div>,
      cell: ({ row }) => (
        <div className="hidden min-w-[140px]">{row.original.system.code}</div>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'category',
      accessorFn: (row) => row.category.name,
      header: () => <div className="hidden">Categoria</div>,
      cell: ({ row }) => (
        <div className="hidden min-w-[140px]">{row.original.category.name}</div>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'name',
      header: () => <div>Nome</div>,
      cell: ({ row }) => (
        <div className="line-clamp-3 min-w-[240px] text-left">
          {row.getValue('name')}
        </div>
      ),
    },
    {
      id: 'lastValue',
      header: () => (
        <div className="hidden text-center lg:block">Último valor</div>
      ),
      cell: ({ row }) => {
        const values = row.original.values
        const lastValue = values[values.length - 1]
        return (
          <div className="hidden min-w-[140px] text-center lg:block">
            {lastValue?.value.toLocaleString('pt-BR')}
          </div>
        )
      },
    },
    {
      accessorKey: 'periodicity',
      header: () => (
        <div className="hidden text-center lg:block">Periodicidade</div>
      ),
      cell: ({ row }) => {
        const lastUpdate = row.original.updatedAt
        return (
          <div className="hidden min-w-[140px] flex-col items-center text-center lg:flex">
            {row.getValue('periodicity')}
            <span className="w-3/4 text-xs text-muted-foreground">
              (atualizado há
              <br />
              {formatDistanceToNow(new Date(lastUpdate), {
                locale: ptBR,
              })}
              )
            </span>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-full min-w-[30px] p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <IndicatorCreateUpdateDialog
                  indicator={indicator}
                  refetchIndicators={refetchIndicators}
                />
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <IndicatorCRUDDataDialog indicator={indicator} />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <IndicatorDeleteDialog
                  indicator={indicator}
                  refetchIndicators={refetchIndicators}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
