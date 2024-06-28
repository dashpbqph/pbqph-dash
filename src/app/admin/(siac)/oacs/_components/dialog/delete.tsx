/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, useState } from 'react'
import { api } from '@/trpc/react'

import { OAC } from '@/types/siac'
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

type DeleteDialogProps = {
  oac: OAC
  refetch: () => void
  className?: string
}

const DeleteDialog = forwardRef<HTMLElement, DeleteDialogProps>(
  ({ oac, refetch, className }: DeleteDialogProps, ref) => {
    const [open, setOpen] = useState(false)
    const { mutateAsync: deleteOAC, isPending } = api.oac.delete.useMutation({
      onSuccess: () => {
        refetch()
        setOpen(false)
      },
    })
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger className={cn('w-full hover:bg-accent', className)}>
          Remover OAC
        </AlertDialogTrigger>
        <AlertDialogContent className="space-y-2 bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja realmente remover o OAC {oac.name}?</AlertDialogTitle>
            <AlertDialogDescription className="text-xl-1">
              Esta ação não pode ser desfeita. Isso vai remover permanentemente o organismo e todos
              os dados relacionados do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-0">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <DialogDeleteButton isLoading={isPending} deleteFn={() => deleteOAC({ id: oac.id })} />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
)
DeleteDialog.displayName = 'DeleteDialog'

export default DeleteDialog
