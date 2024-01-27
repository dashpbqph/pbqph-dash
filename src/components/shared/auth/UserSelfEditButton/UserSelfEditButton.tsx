'use client'

import { useState } from 'react'
import { RouterOutputs } from '@/trpc/shared'
import { UserCog } from 'lucide-react'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import UserSelfEditForm from './UserSelfEditForm'

type UserSelfEditProps = {
  user: Awaited<RouterOutputs['user']['getUserByUsername']>
}

export default function UserSelfEditButton({ user }: UserSelfEditProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="flex space-x-4 py-4 transition-all hover:pl-3"
          onSelect={(e) => e.preventDefault()}
        >
          <UserCog className="h-5 w-5" />
          <span>Editar Conta</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="max-w-[360px] p-7 md:max-w-[460px]">
        <UserSelfEditForm user={user} onSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
