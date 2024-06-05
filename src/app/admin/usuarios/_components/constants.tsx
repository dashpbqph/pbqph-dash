import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'

import type { User } from '@/types/user'
import { mapUserRoleToLabel } from '@/utils/auth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import UserAvatar from '@/components/user-avatar'

import UserCreateUpdateDialog from './dialog/create-update'
import UserDeleteDialog from './dialog/delete-account'
import UserResetPasswordDialog from './dialog/reset-password'

type GetColumnsProps = {
  refetchUsers: () => void
}

export const getColumns = ({ refetchUsers }: GetColumnsProps): ColumnDef<User>[] => {
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
              Usuário
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => (
        <div className="flex min-w-[240px] flex-1 items-center gap-3 pl-[5px]">
          <UserAvatar
            avatar={row.original.avatar}
            name={row.original.name}
            className="h-9 w-9 rounded-sm"
          />
          <div className="flex flex-col">
            <span className="whitespace-nowrap">{row.original.name}</span>
            <span className="text-xs font-light text-muted-foreground">
              {row.original.username}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: () => <div className="hidden md:block">Email</div>,
      cell: ({ row }) => (
        <div className="hidden min-w-[200px] lowercase md:block">{row.getValue('email')}</div>
      ),
    },
    {
      accessorKey: 'role',
      header: () => <div className="hidden sm:block">Função</div>,
      cell: ({ row }) => (
        <div className="hidden max-w-[130px] whitespace-nowrap sm:block">
          {mapUserRoleToLabel(row.getValue('role'))}
        </div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-full min-w-[30px] max-w-[48px] p-0 hover:bg-accent"
              >
                <MoreHorizontal className="h-4 w-4 text-secondary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <UserCreateUpdateDialog user={user} refetchUsers={refetchUsers} />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <UserResetPasswordDialog user={user} />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <UserDeleteDialog user={user} refetchUsers={refetchUsers} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
