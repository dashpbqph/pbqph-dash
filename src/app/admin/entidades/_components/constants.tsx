import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'

import { Entity } from '@/types/entity'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import EntityCreateUpdateDialog from './dialog/create-update'
import EntityDeleteDialog from './dialog/delete-entity'

export const ENTITY_MAP = {
  oac: 'OAC',
  psq: 'PSQ',
  guideline: 'Diretriz SiNAT',
}

type GetColumnsProps = {
  refetchEntities: () => void
}

export const getColumns = ({ refetchEntities }: GetColumnsProps): ColumnDef<Entity>[] => {
  return [
    {
      accessorKey: 'type',
      header: ({ column }) => {
        return (
          <div className="flex">
            <Button
              variant="ghost"
              className="flex justify-start hover:bg-transparent hover:text-accent"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Tipo
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => (
        <div className="min-w-[100px] px-4 font-medium">
          {ENTITY_MAP[row.getValue('type') as keyof typeof ENTITY_MAP]}
        </div>
      ),
    },
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
        <div className="min-w-[240px] px-4 font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const entity = row.original
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
                <EntityCreateUpdateDialog entity={entity} refetchEntities={refetchEntities} />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <EntityDeleteDialog entity={entity} refetchEntities={refetchEntities} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
