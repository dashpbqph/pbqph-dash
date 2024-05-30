/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { forwardRef, useState } from 'react'

import type { ProjectWithRelations } from '@/types/project'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import DialogCreateUpdateTrigger from '@/app/admin/_components/create-update-trigger'

import ProjectCreateUpdateForm from './form'

type ProjectCreateUpdateDialogProps = {
  project?: ProjectWithRelations
  refetchProjects: () => void
  className?: string
}

const ProjectCreateUpdateDialog = forwardRef<HTMLElement, ProjectCreateUpdateDialogProps>(
  ({ project, refetchProjects, className }, ref) => {
    const isEditing = !!project
    const [open, setOpen] = useState(false)

    async function onClose() {
      setOpen(false)
      refetchProjects()
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogCreateUpdateTrigger
          isEditing={isEditing}
          subject="obra"
          className={cn('w-full hover:bg-accent', className)}
        />
        <DialogContent className="max-w-[425px] p-7 md:max-w-[650px]">
          <DialogHeader className="text-left">
            <DialogTitle>{isEditing ? 'Editar' : 'Criar'} obra</DialogTitle>
            <DialogDescription>
              Preencha as informações abaixo para {isEditing ? 'editar a' : 'criar uma nova'} obra.
            </DialogDescription>
          </DialogHeader>
          <ProjectCreateUpdateForm project={project} onClose={onClose} />
        </DialogContent>
      </Dialog>
    )
  },
)
ProjectCreateUpdateDialog.displayName = 'ProjectCreateUpdateDialog'

export default ProjectCreateUpdateDialog
