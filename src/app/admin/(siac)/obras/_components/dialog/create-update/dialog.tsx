/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { forwardRef, useState } from 'react'

import type { ProjectWithRelations } from '@/types/siac'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import DialogCreateUpdateTrigger from '@/app/admin/_components/create-update-trigger'

import CreateUpdateForm from './form'

type CreateUpdateDialogProps = {
  project?: ProjectWithRelations
  refetch: () => void
  className?: string
}

const CreateUpdateDialog = forwardRef<HTMLElement, CreateUpdateDialogProps>(
  ({ project, refetch, className }, ref) => {
    const isEditing = !!project
    const [open, setOpen] = useState(false)

    async function handleClose() {
      setOpen(false)
      refetch()
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogCreateUpdateTrigger
          isEditing={isEditing}
          subject="obra"
          className={cn(isEditing && 'w-full hover:bg-accent', className)}
        />
        <DialogContent className="max-w-[425px] p-7 md:max-w-[650px]">
          <DialogHeader className="text-left">
            <DialogTitle>{isEditing ? 'Editar' : 'Criar'} obra</DialogTitle>
            <DialogDescription>
              Preencha as informações abaixo para {isEditing ? 'editar a' : 'criar uma nova'} obra.
            </DialogDescription>
          </DialogHeader>
          <CreateUpdateForm project={project} onClose={handleClose} />
        </DialogContent>
      </Dialog>
    )
  },
)
CreateUpdateDialog.displayName = 'CreateUpdateDialog'

export default CreateUpdateDialog
