import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
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
import type { OAC } from '@/types/oac'
import { OACCreateUpdateDialog, OACDeleteDialog } from './dialog'

type GetColumnsProps = {
  refetchOACs: () => void
}

export const getColumns = ({
  refetchOACs,
}: GetColumnsProps): ColumnDef<OAC>[] => {
  return [
    {
      accessorKey: 'name',
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
              Nome
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => (
        <div className="min-w-[240px] px-4 font-medium">
          {row.getValue('name')}
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: () => <div>Descrição</div>,
      cell: ({ row }) => (
        <div className="line-clamp-3 min-w-[240px] text-left">
          {row.getValue('description')}
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: () => <div className="hidden lg:block">Data de Criação</div>,
      cell: ({ row }) => (
        <div className="hidden min-w-[140px] lg:block">
          {format(row.original.createdAt, 'd MMM yyyy', { locale: ptBR })}
        </div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const oac = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-full min-w-[30px] max-w-[48px] p-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem>
                <OACCreateUpdateDialog oac={oac} refetchOACs={refetchOACs} />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <OACDeleteDialog oac={oac} refetchOACs={refetchOACs} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
