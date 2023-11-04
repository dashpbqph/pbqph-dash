'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { LogOut, Settings } from 'lucide-react'
import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'

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
  user: Session['user']
}

export default function UserButton({ user }: UserButtonProps) {
  const router = useRouter()

  async function onLogout() {
    await signOut({ redirect: false })
    toast({
      title: 'Logout realizado com sucesso',
      status: 'success',
    })
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full text-center ring-[1.5px] ring-white">
        {user.image ? (
          <Image
            src={user.image}
            alt="imagem do usuário"
            style={{ objectFit: 'contain' }}
            fill
            priority
          />
        ) : (
          user.name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[260px] rounded-md p-4 shadow-xl"
      >
        <DropdownMenuLabel className="flex space-x-4 px-0">
          <div className="relative h-11 w-11 justify-center overflow-hidden rounded-full">
            {user.image ? (
              <Image
                src={user.image}
                alt="imagem do usuário"
                style={{ objectFit: 'contain' }}
                fill
                priority
              />
            ) : (
              user.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')
            )}
          </div>
          <div className="flex flex-col justify-center text-left">
            <div className="font-semibold">{user.name}</div>
            <div className="text-sm font-normal">{user.username}</div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex space-x-4 py-4 transition-all hover:pl-3">
          <Settings className="h-5 w-5" />
          <span>Gerenciar Conta</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onLogout()}
          className="flex space-x-4 py-4 transition-all hover:pl-3"
        >
          <LogOut className="h-5 w-5" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
