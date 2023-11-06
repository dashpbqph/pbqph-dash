'use client'

import * as React from 'react'
import Image from 'next/image'
import { UserRole } from '@prisma/client'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
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
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type User = {
  avatar: string
  username: string
  name: string
  email: string
  createdAt: Date
  role: UserRole
}
const data: User[] = [
  {
    avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Casper',
    username: 'john.doe',
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    createdAt: new Date('2021-01-01'),
    role: UserRole.MEMBER,
  },
  {
    avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Casper',
    username: 'jane.smith',
    name: 'Jane Smith',
    email: 'jane.smith@gmail.com',
    createdAt: new Date('2021-01-02'),
    role: UserRole.MEMBER,
  },
  {
    avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Casper',
    username: 'michael.johnson',
    name: 'Michael Johnson',
    email: 'michael.johnson@gmail.com',
    createdAt: new Date('2021-01-03'),
    role: UserRole.STAFF,
  },
  {
    avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Casper',
    username: 'emily.davis',
    name: 'Emily Davis',
    email: 'emily.davis@gmail.com',
    createdAt: new Date('2021-01-04'),
    role: UserRole.STAFF,
  },
  {
    avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Casper',
    username: 'daniel.brown',
    name: 'Daniel Brown',
    email: 'daniel.brown@gmail.com',
    createdAt: new Date('2021-01-05'),
    role: UserRole.ADMIN,
  },
  {
    avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Casper',
    username: 'olivia.wilson',
    name: 'Olivia Wilson',
    email: 'olivia.wilson@gmail.com',
    createdAt: new Date('2021-01-06'),
    role: UserRole.ADMIN,
  },
  {
    avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Casper',
    username: 'liam.martinez',
    name: 'Liam Martinez',
    email: 'liam.martinez@gmail.com',
    createdAt: new Date('2021-01-07'),
    role: UserRole.MEMBER,
  },
  {
    avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Casper',
    username: 'ava.lee',
    name: 'Ava Lee',
    email: 'ava.lee@gmail.com',
    createdAt: new Date('2021-01-08'),
    role: UserRole.MEMBER,
  },
]

const mapUserRoleToLabel = (role: UserRole) => {
  switch (role) {
    case UserRole.MEMBER:
      return 'Membro'
    case UserRole.STAFF:
      return 'Equipe'
    case UserRole.ADMIN:
      return 'Administrador'
    case UserRole.OWNER:
      return 'Proprietário'
  }
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <div className="flex w-[200px]">
          <Button
            variant="ghost"
            className="flex justify-start"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Usuário
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => (
      <div className="flex gap-3">
        <Image
          src={row.original.avatar}
          className="h-9 w-9 rounded-full"
          alt=""
          width={100}
          height={100}
        />
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
    // date format like 5/10/2021
    accessorKey: 'createdAt',
    header: 'Data de Criação',
    cell: ({ row }) => (
      // <div>{format(row.original.createdAt, 'P', { locale: ptBR })}</div>
      <div>
        {format(row.original.createdAt, 'd MMM yyyy', { locale: ptBR })}
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'role',
    header: 'Função',
    cell: ({ row }) => <div>{mapUserRoleToLabel(row.getValue('role'))}</div>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-full p-0">
              <span className="sr-only">Abrir menu de ações</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem>Editar usuário</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Redefinir senha</DropdownMenuItem>
            <DropdownMenuItem>Remover usuário</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function AdminUsersTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="flex w-full flex-1 flex-col gap-4">
      <Input
        placeholder="Buscar usuários..."
        value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
        onChange={(event) =>
          table.getColumn('email')?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
      <div className="flex-1 overflow-hidden rounded-md border bg-secondary">
        <Table className="bg-white">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="bg-secondary">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{' '}
          {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  )
}
