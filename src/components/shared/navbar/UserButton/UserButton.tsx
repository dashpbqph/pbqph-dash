'use client'

import { useRouter } from 'next/navigation'
import { api as server } from '@/trpc/server'
import { signOut } from 'next-auth/react'

import { UserAvatar } from '@/components/shared/auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from '@/components/ui/use-toast'
import { isAdminOrOwner } from '@/utils/auth'
import AdminMenuItem from './AdminMenuItem'
import LogoutMenuItem from './LogoutMenuItem'
import UserButtonHeader from './UserButtonHeader'
import { UserFormSelfEdit } from './UserFormSelfEdit'

type User = Awaited<ReturnType<typeof server.user.getUserByUsername.query>>

type UserButtonProps = {
  user: User
}

export default function UserButton({ user }: UserButtonProps) {
  const router = useRouter()
  const { avatar, name, username, role } = user

  async function handleLogout() {
    await signOut({ redirect: false })
      .then(() => {
        toast({
          title: 'Logout com sucesso',
          status: 'success',
        })
        router.refresh()
      })
      .catch(() => {
        toast({
          title: 'Erro ao fazer logout',
          status: 'error',
        })
      })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full text-center ring-[1.5px] ring-white">
        <UserAvatar avatar={avatar} name={name} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[260px] rounded-md p-4 shadow-xl"
      >
        <UserButtonHeader avatar={avatar} name={name} username={username} />
        <DropdownMenuSeparator />
        <UserFormSelfEdit user={user} />
        {isAdminOrOwner(role) && <AdminMenuItem />}
        <LogoutMenuItem onLogout={handleLogout} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
