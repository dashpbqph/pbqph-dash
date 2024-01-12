import { useState } from 'react'
import { api } from '@/trpc/react'

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

export default function DeleteUserDialogButton({
  username,
  refetchUsers,
}: {
  username: string
  refetchUsers: () => void
}) {
  const [open, setOpen] = useState(false)
  const { mutate, isLoading } = api.user.delete.useMutation({
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
            Deseja realmente remover o usuário {username}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xl-1">
            Esta ação não pode ser desfeita. Isso vai remover permanentemente o
            usuário e todos os seus dados do sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-0">
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          {isLoading ? (
            <Button className="flex cursor-progress flex-row gap-2 bg-primary text-sm text-primary-foreground">
              <Spinner />
              Removendo...
            </Button>
          ) : (
            <Button
              className="bg-primary text-sm text-primary-foreground"
              onClick={() => mutate({ username })}
            >
              Confirmar
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
