/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, useState } from 'react'
import { api } from '@/trpc/react'

import { Entity } from '@/types/entity'
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

type EntityDeleteDialogProps = {
  entity: Entity
  refetchEntities: () => void
  className?: string
}

const EntityDeleteDialog = forwardRef<HTMLElement, EntityDeleteDialogProps>(
  ({ entity, refetchEntities, className }: EntityDeleteDialogProps, ref) => {
    const [open, setOpen] = useState(false)
    const { mutateAsync: deleteEntity, isPending } = api.entity.delete.useMutation({
      onSuccess: () => {
        refetchEntities()
        setOpen(false)
      },
    })
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger className={cn('w-full hover:bg-accent', className)}>
          Remover Entidade
        </AlertDialogTrigger>
        <AlertDialogContent className="space-y-2 bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja realmente remover a entidade {entity.name}?</AlertDialogTitle>
            <AlertDialogDescription className="text-xl-1">
              Esta ação não pode ser desfeita. Isso vai remover permanentemente a entidade e todos
              os dados relacionados do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-0">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <DialogDeleteButton
              isLoading={isPending}
              deleteFn={() => deleteEntity({ id: entity.id, type: entity.type })}
            />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
)
EntityDeleteDialog.displayName = 'EntityDeleteDialog'

export default EntityDeleteDialog
