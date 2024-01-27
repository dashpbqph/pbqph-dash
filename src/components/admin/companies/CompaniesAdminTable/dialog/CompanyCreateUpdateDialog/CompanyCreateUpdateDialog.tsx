'use client'

import { useState } from 'react'
import { Building } from 'lucide-react'

import { DialogCreateUpdateTrigger } from '@/components/shared/dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Company } from '@/types/company'
import CompanyCreateUpdateForm from './CompanyCreateUpdateForm'

type CompanyCreateUpdateDialogProps = {
  company?: Company
  refetchCompanies: () => void
}

export default function CompanyCreateUpdateDialog({
  company,
  refetchCompanies,
}: CompanyCreateUpdateDialogProps) {
  const isEditing = !!company
  const [open, setOpen] = useState(false)

  async function onClose() {
    setOpen(false)
    refetchCompanies()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogCreateUpdateTrigger
        isEditing={isEditing}
        subject="construtora"
        icon={Building}
      />
      <DialogContent className="max-w-[425px] p-7 md:max-w-[650px]">
        <DialogHeader className="text-left">
          <DialogTitle>
            {isEditing ? 'Editar' : 'Criar'} construtora
          </DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para {isEditing ? 'editar' : 'criar'}{' '}
            uma
            {!isEditing && ' nova'} construtora.
          </DialogDescription>
        </DialogHeader>
        <CompanyCreateUpdateForm company={company} onClose={onClose} />
      </DialogContent>
    </Dialog>
  )
}
