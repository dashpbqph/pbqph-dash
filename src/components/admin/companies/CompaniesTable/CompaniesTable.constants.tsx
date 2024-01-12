import { api as server } from '@/trpc/server'
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

type Company = Awaited<ReturnType<typeof server.company.getAll.query>>[number]

export const getColumns = ({
  refetchCompanies,
}: {
  refetchCompanies: () => void
}): ColumnDef<Company>[] => {
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
        <div className="flex min-w-[240px] flex-1 items-center gap-3">
          {row.getValue('name')}
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
        const company = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-full min-w-[30px] p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem>Editar Construtora</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Remover Construtora</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
