import { ColumnDef } from '@tanstack/react-table'
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
import type { ProjectWithRelations } from '@/types/project'
import { ProjectCreateUpdateDialog, ProjectDeleteDialog } from './dialog'

type GetColumnsProps = {
  refetchProjects: () => void
}

export const getColumns = ({
  refetchProjects,
}: GetColumnsProps): ColumnDef<ProjectWithRelations>[] => {
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
      accessorKey: 'company',
      accessorFn: (row) => row.company.name,
      header: () => <div>Construtora</div>,
      cell: ({ row }) => (
        <div className="min-w-[140px]">{row.original.company.name}</div>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
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
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const project = row.original
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
                <ProjectCreateUpdateDialog
                  project={project}
                  refetchProjects={refetchProjects}
                />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <ProjectDeleteDialog
                  project={project}
                  refetchProjects={refetchProjects}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
