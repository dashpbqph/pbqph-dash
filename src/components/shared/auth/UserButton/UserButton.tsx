import Image from 'next/image'
import Link from 'next/link'
import { RouterOutputs } from '@/trpc/shared'
import { Settings } from 'lucide-react'

import { UserSelfEditButton } from '@/components/shared/auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { isAdmin } from '@/utils/auth'
import UserLogoutButton from './UserLogoutButton'

export function UserAvatar({
  avatar,
  name,
}: {
  avatar: string | null
  name: string
}) {
  return (
    <div className="relative flex h-11 w-11 overflow-hidden rounded-full">
      {avatar ? (
        <Image
          src={avatar}
          alt="imagem do usuário"
          placeholder="blur"
          blurDataURL={avatar}
          fill
          style={{ objectFit: 'contain' }}
          sizes="(max-width: 768px) 20vw, 10vw"
        />
      ) : (
        <span className="flex w-full items-center justify-center">
          {name
            ?.split(' ')
            .map((n) => n[0])
            .join('')}
        </span>
      )}
    </div>
  )
}

type UserButtonProps = {
  user: Awaited<RouterOutputs['user']['getUserByUsername']>
}

export default function UserButton({ user }: UserButtonProps) {
  const { avatar, name, username, role, company } = user

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
        <DropdownMenuLabel className="flex space-x-3 px-0">
          <div className="relative h-11 w-11 justify-center overflow-hidden rounded-full border-[1.5px]">
            <UserAvatar avatar={avatar} name={name} />
          </div>
          <div className="flex flex-col justify-center text-left">
            <span className="font-semibold">
              {name}{' '}
              {company ? <span className="font-normal">({company})</span> : ''}
            </span>
            <span className="text-sm font-normal">{username}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <UserSelfEditButton user={user} />
        {isAdmin(role) && (
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
        <UserLogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
