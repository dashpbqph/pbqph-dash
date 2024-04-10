import { useState } from 'react'
import { api } from '@/trpc/react'

import { DialogButtonDelete } from '@/components/shared/dialog'
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
import type { User } from '@/types/user'

type UserDeleteDialogProps = {
  user: User
  refetchUsers: () => void
  className?: string
}

export default function UserDeleteDialog({
  user,
  refetchUsers,
  className,
}: UserDeleteDialogProps) {
  const [open, setOpen] = useState(false)
  const { mutateAsync: deleteUser, isLoading } = api.user.delete.useMutation({
    onSuccess: () => {
      refetchUsers()
      setOpen(false)
    },
  })
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className={className}>
        Remover usuário
      </AlertDialogTrigger>
      <AlertDialogContent className="space-y-2 bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Deseja realmente remover o usuário {user.username}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xl-1">
            Esta ação não pode ser desfeita. Isso vai remover permanentemente o
            usuário e todos os seus dados do sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-0">
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <DialogButtonDelete
            isLoading={isLoading}
            deleteFn={() => deleteUser({ username: user.username })}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
