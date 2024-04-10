import { useState } from 'react'
import { api } from '@/trpc/react'

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
import type { ProjectWithRelations } from '@/types/project'

type ProjectDeleteDialogProps = {
  project: ProjectWithRelations
  refetchProjects: () => void
  className?: string
}

export default function ProjectDeleteDialog({
  project,
  refetchProjects,
  className,
}: ProjectDeleteDialogProps) {
  const [open, setOpen] = useState(false)
  const { mutateAsync: deleteProject, isLoading } =
    api.project.delete.useMutation({
      onSuccess: () => {
        refetchProjects()
        setOpen(false)
      },
    })
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className={className}>
        Remover obra
      </AlertDialogTrigger>
      <AlertDialogContent className="space-y-2 bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Deseja realmente remover a obra {project.name}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xl-1">
            Esta ação não pode ser desfeita. Isso vai remover permanentemente a
            obra do sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-0">
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <DialogButtonDelete
            isLoading={isLoading}
            deleteFn={() => deleteProject({ id: project.id })}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
