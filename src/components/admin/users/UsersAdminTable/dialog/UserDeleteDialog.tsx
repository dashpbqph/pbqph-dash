import { useState } from 'react'
import { api } from '@/trpc/react'

import { cn } from '@/lib/utils'
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
import { Button } from '@/components/ui/button'
import Spinner from '@/components/ui/spinner'
import type { User } from '@/types/user'

type UserDeleteDialogProps = {
  user: User
  refetchUsers: () => void
}

export default function UserDeleteDialog({
  user,
  refetchUsers,
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
      <AlertDialogTrigger>Remover usuário</AlertDialogTrigger>
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
          <Button
            className={cn(
              'bg-primary text-sm text-primary-foreground',
              isLoading && 'group flex cursor-progress flex-row gap-2',
            )}
            onClick={() =>
              !isLoading ? deleteUser({ username: user.username }) : undefined
            }
            data-loading={isLoading}
          >
            <Spinner className="hidden group-data-[loading=true]:block" />
            {isLoading ? 'Removendo...' : 'Confirmar'}
          </Button>
          <DialogButtonDelete
            isLoading={isLoading}
            deleteFn={() => deleteUser({ username: user.username })}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
