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
        })
        router.refresh()
      })
      .catch(() => {
        toast({
          title: 'Erro ao fazer logout',
        })
      })
  }

  return (
    <DropdownMenuItem
      onClick={handleLogout}
      className="flex space-x-4 py-4 text-gray-400 transition-all hover:pl-3"
    >
      <button>
        <LogOut className="h-5 w-5" />
        <span>Sair</span>
      </button>
    </DropdownMenuItem>
  )
}
