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
import type { Company } from '@/types/company'

type CompanyDeleteDialogProps = {
  company: Company
  refetchCompanies: () => void
}

export default function CompanyDeleteDialog({
  company,
  refetchCompanies,
}: CompanyDeleteDialogProps) {
  const [open, setOpen] = useState(false)
  const { mutateAsync: deleteCompany, isLoading } =
    api.company.delete.useMutation({
      onSuccess: () => {
        refetchCompanies()
        setOpen(false)
      },
    })
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>Remover construtora</AlertDialogTrigger>
      <AlertDialogContent className="space-y-2 bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Deseja realmente remover a construtora {company.name}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xl-1">
            Esta ação não pode ser desfeita. Isso vai remover permanentemente a
            construtora, todas as suas respectivas obras e usuários do sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-0">
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <DialogButtonDelete
            isLoading={isLoading}
            deleteFn={() => deleteCompany({ id: company.id })}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
