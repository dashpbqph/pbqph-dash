import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'

import { DATEC } from '@/types/sinat'
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

export const getColumns = ({ refetch }: GetColumnsProps): ColumnDef<DATEC>[] => {
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
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const datec = row.original
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
                <CreateUpdateDialog datec={datec} refetch={refetch} />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <DeleteDialog datec={datec} refetch={refetch} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
