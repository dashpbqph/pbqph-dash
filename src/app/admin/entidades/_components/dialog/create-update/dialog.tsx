/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { forwardRef, useState } from 'react'

import { Entity } from '@/types/entity'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import DialogCreateUpdateTrigger from '@/app/admin/_components/create-update-trigger'

import EntityCreateUpdateForm from './form'

type EntityCreateUpdateDialogProps = {
  entity?: Entity
  refetchEntities: () => void
  className?: string
}

const EntityCreateUpdateDialog = forwardRef<HTMLElement, EntityCreateUpdateDialogProps>(
  ({ entity, refetchEntities, className }: EntityCreateUpdateDialogProps, ref) => {
    const isEditing = !!entity
    const [open, setOpen] = useState(false)

    async function onClose() {
      setOpen(false)
      refetchEntities()
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogCreateUpdateTrigger
          isEditing={isEditing}
          subject="Entidade"
          className={cn(isEditing && 'w-full hover:bg-accent', className)}
        />
        <DialogContent className="max-w-[425px] p-7 md:max-w-[650px]">
          <DialogHeader className="text-left">
            <DialogTitle>{isEditing ? 'Editar' : 'Criar'} entidade</DialogTitle>
            <DialogDescription>
              Preencha as informações abaixo para {isEditing ? 'editar' : 'criar'} uma
              {!isEditing && ' nova'} entidade.
            </DialogDescription>
          </DialogHeader>
          <EntityCreateUpdateForm entity={entity} onClose={onClose} />
        </DialogContent>
      </Dialog>
    )
  },
)
EntityCreateUpdateDialog.displayName = 'EntityCreateUpdateDialog'

export default EntityCreateUpdateDialog
