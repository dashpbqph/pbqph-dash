'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { toast } from '@/components/ui/use-toast'

export default function LogoutButton() {
  const router = useRouter()

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
    <DropdownMenuItem
      onClick={handleLogout}
      className="flex w-full gap-x-4 py-3 transition-all hover:bg-accent hover:pl-3"
    >
      <LogOut className="h-5 w-5" />
      <span>Sair</span>
    </DropdownMenuItem>
  )
}
