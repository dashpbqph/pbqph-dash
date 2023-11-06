'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UserRole } from '@prisma/client'
import { LogOut, Settings, UserCog } from 'lucide-react'
import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'

import { UserAvatar } from '@/components/feature/auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from '@/components/ui/use-toast'

interface UserButtonProps {
  session: Session
}

export default function UserButton({ session }: UserButtonProps) {
  const router = useRouter()
  const { image: avatar, name, username, role } = session.user

  async function handleLogout() {
    await signOut({ redirect: false })
    toast({
      title: 'Logout com sucesso',
      status: 'success',
    })
    router.refresh()
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
        <DropdownMenuLabel className="flex space-x-4 px-0">
          <div className="relative h-11 w-11 justify-center overflow-hidden rounded-full">
            <UserAvatar avatar={avatar} name={name} />
          </div>
          <div className="flex flex-col justify-center text-left">
            <div className="font-semibold">{name}</div>
            <div className="text-sm font-normal">{username}</div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex space-x-4 py-4 transition-all hover:pl-3">
          <UserCog className="h-5 w-5" />
          <span>Editar Conta</span>
        </DropdownMenuItem>
        {(role === UserRole.OWNER || role === UserRole.ADMIN) && (
          <DropdownMenuItem
            className="flex space-x-4 py-4 transition-all hover:pl-3"
            asChild
          >
            <Link href="/admin/usuarios">
              <Settings className="h-5 w-5" />
              <span>Administração</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => handleLogout()}
          className="flex space-x-4 py-4 transition-all hover:pl-3"
        >
          <LogOut className="h-5 w-5" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
