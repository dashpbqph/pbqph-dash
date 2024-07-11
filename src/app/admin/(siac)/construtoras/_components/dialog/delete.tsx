/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, useState } from 'react'
import { api } from '@/trpc/react'

import type { Company } from '@/types/siac'
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
  company: Company
  refetch: () => void
  className?: string
}

const DeleteDialog = forwardRef<HTMLElement, DeleteDialogProps>(
  ({ company, refetch, className }, ref) => {
    const [open, setOpen] = useState(false)
    const { mutateAsync: deleteCompany, isPending } = api.company.delete.useMutation({
      onSuccess: () => {
        refetch()
        setOpen(false)
      },
    })
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger className={cn('w-full hover:bg-accent', className)}>
          Remover construtora
        </AlertDialogTrigger>
        <AlertDialogContent className="space-y-2 bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Deseja realmente remover a construtora {company.name}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xl-1">
              Esta ação não pode ser desfeita. Isso vai remover permanentemente a construtora, todas
              as suas respectivas obras e usuários do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-0">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <DialogDeleteButton
              isLoading={isPending}
              deleteFn={() => deleteCompany({ id: company.id })}
            />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
)
DeleteDialog.displayName = 'DeleteDialog'

export default DeleteDialog
