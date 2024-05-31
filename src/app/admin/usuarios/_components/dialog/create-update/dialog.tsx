/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { forwardRef, useState } from 'react'

import type { User } from '@/types/user'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import DialogCreateUpdateTrigger from '@/app/admin/_components/create-update-trigger'

import UserCreateUpdateForm from './form'

type UserCreateUpdateDialogProps = {
  user?: User
  refetchUsers: () => void
  className?: string
}

const UserCreateUpdateDialog = forwardRef<HTMLElement, UserCreateUpdateDialogProps>(
  ({ user, refetchUsers, className }, ref) => {
    const isEditing = !!user
    const [open, setOpen] = useState(false)

    async function onClose() {
      setOpen(false)
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogCreateUpdateTrigger
          isEditing={isEditing}
          subject="usuário"
          className={cn(isEditing && 'w-full hover:bg-accent', className)}
        />
        <DialogContent
          className="max-w-[425px] p-7 md:max-w-[650px]"
          data-testid="user-form-dialog"
        >
          <DialogHeader className="text-left">
            <DialogTitle>{isEditing ? 'Editar' : 'Criar'} usuário</DialogTitle>
            <DialogDescription>
              Preencha as informações abaixo para {isEditing ? 'editar o' : 'criar um novo'}{' '}
              usuário.
            </DialogDescription>
          </DialogHeader>
          <UserCreateUpdateForm user={user} onClose={onClose} refetchUsers={refetchUsers} />
        </DialogContent>
      </Dialog>
    )
  },
)
UserCreateUpdateDialog.displayName = 'UserCreateUpdateDialog'

export default UserCreateUpdateDialog
