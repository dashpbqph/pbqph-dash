import { LogOut } from 'lucide-react'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

type LogoutMenuItemProps = {
  onLogout: () => void
}

export default function LogoutMenuItem({ onLogout }: LogoutMenuItemProps) {
  return (
    <DropdownMenuItem
      onClick={onLogout}
      className="flex space-x-4 py-4 transition-all hover:pl-3"
    >
      <LogOut className="h-5 w-5" />
      <span>Sair</span>
    </DropdownMenuItem>
  )
}
