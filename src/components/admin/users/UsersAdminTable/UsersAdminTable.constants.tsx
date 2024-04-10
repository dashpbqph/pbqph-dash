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
import { mapUserRoleToLabel } from '@/utils/auth'
import type { User } from '@/types/user'
import {
  UserCreateUpdateDialog,
  UserDeleteDialog,
  UserResetPasswordDialog,
} from './dialog'
import UserAvatarWithSkeleton from './UserAvatarWithSkeleton'

type GetColumnsProps = {
  refetchUsers: () => void
}

export const getColumns = ({
  refetchUsers,
}: GetColumnsProps): ColumnDef<User>[] => {
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
              Usuário
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => (
        <div className="flex min-w-[240px] flex-1 items-center gap-3">
          <UserAvatarWithSkeleton src={row.original.avatar} />
          <div className="flex flex-col">
            <span className="whitespace-nowrap font-semibold">
              {row.original.name}
            </span>
            <span className="text-sm text-muted-foreground">
              {row.original.username}
            </span>
          </div>
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
      accessorKey: 'email',
      header: () => <div className="hidden md:block">Email</div>,
      cell: ({ row }) => (
        <div className="hidden min-w-[200px] lowercase md:block">
          {row.getValue('email')}
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: () => <div className="hidden sm:block">Função</div>,
      cell: ({ row }) => (
        <div className="hidden max-w-[130px] sm:block">
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
                className="h-8 w-full min-w-[30px] max-w-[48px] p-0"
                data-testid="actions-menu-button"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem>
                <UserCreateUpdateDialog
                  user={user}
                  refetchUsers={refetchUsers}
                />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserResetPasswordDialog user={user} />
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserDeleteDialog user={user} refetchUsers={refetchUsers} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
