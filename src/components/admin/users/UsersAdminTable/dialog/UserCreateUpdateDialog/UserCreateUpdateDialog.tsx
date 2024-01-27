'use client'

import { useState } from 'react'
import { User as UserIcon } from 'lucide-react'

import { DialogCreateUpdateTrigger } from '@/components/shared/dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { User } from '@/types/user'
import UserCreateUpdateForm from './UserCreateUpdateForm'

type UserCreateUpdateDialogProps = {
  user?: User
  refetchUsers: () => void
}

export default function UserCreateUpdateDialog({
  user,
  refetchUsers,
}: UserCreateUpdateDialogProps) {
  const isEditing = !!user
  const [open, setOpen] = useState(false)

  async function onClose() {
    setOpen(false)
    refetchUsers()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogCreateUpdateTrigger
        isEditing={isEditing}
        subject="usuário"
        icon={UserIcon}
      />
      <DialogContent className="max-w-[425px] p-7 md:max-w-[650px]">
        <DialogHeader className="text-left">
          <DialogTitle>{isEditing ? 'Editar' : 'Criar'} usuário</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para{' '}
            {isEditing ? 'editar o' : 'criar um novo'} usuário.
          </DialogDescription>
        </DialogHeader>
        <UserCreateUpdateForm user={user} onClose={onClose} />
      </DialogContent>
    </Dialog>
  )
}
