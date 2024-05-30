/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, useState } from 'react'
import { api } from '@/trpc/react'

import type { ProjectWithRelations } from '@/types/project'
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

type ProjectDeleteDialogProps = {
  project: ProjectWithRelations
  refetchProjects: () => void
  className?: string
}

const ProjectDeleteDialog = forwardRef<HTMLElement, ProjectDeleteDialogProps>(
  ({ project, refetchProjects, className }, ref) => {
    const [open, setOpen] = useState(false)
    const { mutateAsync: deleteProject, isPending } = api.project.delete.useMutation({
      onSuccess: () => {
        refetchProjects()
        setOpen(false)
      },
    })
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger className={cn('w-full bg-accent', className)}>
          Remover obra
        </AlertDialogTrigger>
        <AlertDialogContent className="space-y-2 bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja realmente remover a obra {project.name}?</AlertDialogTitle>
            <AlertDialogDescription className="text-xl-1">
              Esta ação não pode ser desfeita. Isso vai remover permanentemente a obra do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-0">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <DialogDeleteButton
              isLoading={isPending}
              deleteFn={() => deleteProject({ id: project.id })}
            />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
)
ProjectDeleteDialog.displayName = 'ProjectDeleteDialog'

export default ProjectDeleteDialog
