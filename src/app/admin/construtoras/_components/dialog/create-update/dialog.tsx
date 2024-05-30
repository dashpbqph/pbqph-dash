/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { forwardRef, useState } from 'react'

import type { Company } from '@/types/company'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import DialogCreateUpdateTrigger from '@/app/admin/_components/create-update-trigger'

import CompanyCreateUpdateForm from './form'

type CompanyCreateUpdateDialogProps = {
  company?: Company
  refetchCompanies: () => void
  className?: string
}

const CompanyCreateUpdateDialog = forwardRef<HTMLElement, CompanyCreateUpdateDialogProps>(
  ({ company, refetchCompanies, className }, ref) => {
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
          className={cn(isEditing && 'w-full hover:bg-accent', className)}
        />
        <DialogContent className="max-w-[425px] p-7 md:max-w-[650px]">
          <DialogHeader className="text-left">
            <DialogTitle>{isEditing ? 'Editar' : 'Criar'} construtora</DialogTitle>
            <DialogDescription>
              Preencha as informações abaixo para {isEditing ? 'editar' : 'criar'} uma
              {!isEditing && ' nova'} construtora.
            </DialogDescription>
          </DialogHeader>
          <CompanyCreateUpdateForm company={company} onClose={onClose} />
        </DialogContent>
      </Dialog>
    )
  },
)
CompanyCreateUpdateDialog.displayName = 'CompanyCreateUpdateDialog'

export default CompanyCreateUpdateDialog
