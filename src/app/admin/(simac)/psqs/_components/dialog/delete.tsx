/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, useState } from 'react'
import { api } from '@/trpc/react'

import { PSQ } from '@/types/simac'
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
  psq: PSQ
  refetch: () => void
  className?: string
}

const DeleteDialog = forwardRef<HTMLElement, DeleteDialogProps>(
  ({ psq, refetch, className }: DeleteDialogProps, ref) => {
    const [open, setOpen] = useState(false)
    const { mutateAsync: deletePSQ, isPending } = api.psq.delete.useMutation({
      onSuccess: () => {
        refetch()
        setOpen(false)
      },
    })
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger className={cn('w-full hover:bg-accent', className)}>
          Remover PSQ
        </AlertDialogTrigger>
        <AlertDialogContent className="space-y-2 bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja realmente remover o PSQ {psq.name}?</AlertDialogTitle>
            <AlertDialogDescription className="text-xl-1">
              Esta ação não pode ser desfeita. Isso vai remover permanentemente o programa e todos
              os dados relacionados do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-0">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <DialogDeleteButton isLoading={isPending} deleteFn={() => deletePSQ({ id: psq.id })} />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
)
DeleteDialog.displayName = 'DeleteDialog'

export default DeleteDialog
