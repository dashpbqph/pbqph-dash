/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, useState } from 'react'
import { api } from '@/trpc/react'

import type { User } from '@/types/user'
import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import DialogDeleteButton from '@/app/admin/_components/dialog-delete-button'

type UserDeleteDialogProps = {
  user: User
  refetchUsers: () => void
  className?: string
}

const UserDeleteDialog = forwardRef<HTMLElement, UserDeleteDialogProps>(
  ({ user, refetchUsers, className }, ref) => {
    const [open, setOpen] = useState(false)
    const { mutateAsync: deleteUser, isPending } = api.user.delete.useMutation({
      onSuccess: () => {
        refetchUsers()
        setOpen(false)
      },
    })
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger className={cn('w-full hover:bg-accent', className)}>
          Remover usuário
        </AlertDialogTrigger>
        <AlertDialogContent className="space-y-2 bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja realmente remover o usuário {user.username}?</AlertDialogTitle>
            <AlertDialogDescription className="text-xl-1">
              Esta ação não pode ser desfeita. Isso vai remover permanentemente o usuário e todos os
              seus dados do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-0">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <DialogDeleteButton
              isLoading={isPending}
              deleteFn={() => deleteUser({ username: user.username })}
            />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
)
UserDeleteDialog.displayName = 'UserDeleteDialog'

export default UserDeleteDialog
