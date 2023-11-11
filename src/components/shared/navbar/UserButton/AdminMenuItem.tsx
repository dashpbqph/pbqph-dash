import Link from 'next/link'
import { Settings } from 'lucide-react'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

export default function AdminMenuItem() {
  return (
    <DropdownMenuItem
      className="flex space-x-4 py-4 transition-all hover:pl-3"
      asChild
    >
      <Link href="/admin/usuarios">
        <Settings className="h-5 w-5" />
        <span>Administração</span>
      </Link>
    </DropdownMenuItem>
  )
}
