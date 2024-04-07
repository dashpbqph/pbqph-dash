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
import type { OAC } from '@/types/oac'

type OACDeleteDialogProps = {
  oac: OAC
  refetchOACs: () => void
}

export default function OACDeleteDialog({
  oac,
  refetchOACs,
}: OACDeleteDialogProps) {
  const [open, setOpen] = useState(false)
  const { mutateAsync: deleteOAC, isLoading } = api.oac.delete.useMutation({
    onSuccess: () => {
      refetchOACs()
      setOpen(false)
    },
  })
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>Remover OAC</AlertDialogTrigger>
      <AlertDialogContent className="space-y-2 bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Deseja realmente remover a construtora {oac.name}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xl-1">
            Esta ação não pode ser desfeita. Isso vai remover permanentemente o
            OAC, todas as suas respectivas obras e usuários do sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-0">
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <DialogButtonDelete
            isLoading={isLoading}
            deleteFn={() => deleteOAC({ id: oac.id })}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
