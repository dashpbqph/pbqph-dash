import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'

import type { Company } from '@/types/company'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import CompanyCreateUpdateDialog from './dialog/create-update'
import CompanyDeleteDialog from './dialog/delete-company'

type GetColumnsProps = {
  refetchCompanies: () => void
}

export const getColumns = ({ refetchCompanies }: GetColumnsProps): ColumnDef<Company>[] => {
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
        <div className="min-w-[240px] px-4 font-medium">{row.getValue('name')}</div>
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
                <CompanyCreateUpdateDialog company={company} refetchCompanies={refetchCompanies} />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <CompanyDeleteDialog company={company} refetchCompanies={refetchCompanies} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
