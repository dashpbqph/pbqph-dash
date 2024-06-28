import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'

import type { ProjectWithRelations } from '@/types/siac'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import CreateUpdateDialog from './dialog/create-update'
import DeleteDialog from './dialog/delete'

type GetColumnsProps = {
  refetch: () => void
}

export const getColumns = ({ refetch }: GetColumnsProps): ColumnDef<ProjectWithRelations>[] => {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <div className="flex">
            <Button
              variant="ghost"
              className="flex justify-start hover:bg-transparent hover:text-accent"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Nome
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => (
        <div className="flex h-10 min-w-[240px] items-center px-4 font-medium">
          {row.getValue('name')}
        </div>
      ),
    },
    {
      accessorKey: 'company',
      accessorFn: (row) => row.company.name,
      header: () => <div>Construtora</div>,
      cell: ({ row }) => <div className="min-w-[140px]">{row.original.company.name}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const project = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-full min-w-[30px] max-w-[48px] p-0 hover:bg-accent"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <CreateUpdateDialog project={project} refetch={refetch} />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <DeleteDialog project={project} refetch={refetch} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
