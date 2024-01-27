'use client'

import { useState } from 'react'
import { BrickWall } from 'lucide-react'

import { DialogCreateUpdateTrigger } from '@/components/shared/dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { ProjectWithRelations } from '@/types/project'
import ProjectCreateUpdateForm from './ProjectCreateUpdateForm'

type ProjectCreateUpdateDialogProps = {
  project?: ProjectWithRelations
  refetchProjects: () => void
}

export default function ProjectCreateUpdateDialog({
  project,
  refetchProjects,
}: ProjectCreateUpdateDialogProps) {
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
        icon={BrickWall}
      />
      <DialogContent className="max-w-[425px] p-7 md:max-w-[650px]">
        <DialogHeader className="text-left">
          <DialogTitle>{isEditing ? 'Editar' : 'Criar'} obra</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para{' '}
            {isEditing ? 'editar a' : 'criar uma nova'} obra.
          </DialogDescription>
        </DialogHeader>
        <ProjectCreateUpdateForm project={project} onClose={onClose} />
      </DialogContent>
    </Dialog>
  )
}
