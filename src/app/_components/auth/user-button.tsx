import Link from 'next/link'
import { RouterOutputs } from '@/server/api/root'
import { Settings } from 'lucide-react'

import { isAdmin } from '@/utils/auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import GeomIcon from '@/components/geom-icon'
import UserAvatar from '@/components/user-avatar'

import LogoutButton from './logout-button'

type UserButtonProps = {
  user: Awaited<RouterOutputs['user']['getUserByUsername']>
}

export default function UserButton({ user }: UserButtonProps) {
  const { avatar, name, username, role, company } = user

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-8 items-end gap-0.5 text-center focus:outline-none">
        <div className="flex overflow-hidden rounded-sm">
          <div className="w-[9px] bg-accent" />
          <UserAvatar avatar={avatar} name={name} className="h-8 w-8 rounded-none" />
        </div>
        <GeomIcon className="h-[9px] w-[9px] text-primary" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="flex w-[230px] flex-col gap-0.5 rounded-md p-4 shadow-xl"
      >
        <DropdownMenuLabel className="flex gap-x-3 px-0">
          <UserAvatar avatar={avatar} name={name} className="rounded-md" />
          <div className="flex flex-col justify-center gap-0.5 text-left">
            <span className="font-semibold text-secondary">
              {name} {company && <span className="font-normal">({company})</span>}
            </span>
            <span className="text-xs font-extralight">{username}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAdmin(role) && (
          <DropdownMenuItem className="flex space-x-4 py-3 transition-all hover:pl-3" asChild>
            <Link href="/admin/usuarios">
              <Settings className="h-5 w-5" />
              <span>Administração</span>
            </Link>
          </DropdownMenuItem>
        )}
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
