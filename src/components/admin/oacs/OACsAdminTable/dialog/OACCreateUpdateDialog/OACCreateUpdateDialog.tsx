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
import type { OAC } from '@/types/oac'
import OACCreateUpdateForm from './OACCreateUpdateForm'

type OACCreateUpdateDialogProps = {
  oac?: OAC
  refetchOACs: () => void
}

export default function OACCreateUpdateDialog({
  oac,
  refetchOACs,
}: OACCreateUpdateDialogProps) {
  const isEditing = !!oac
  const [open, setOpen] = useState(false)

  async function onClose() {
    setOpen(false)
    refetchOACs()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogCreateUpdateTrigger
        isEditing={isEditing}
        subject="OAC"
        icon={Building}
      />
      <DialogContent className="max-w-[425px] p-7 md:max-w-[650px]">
        <DialogHeader className="text-left">
          <DialogTitle>{isEditing ? 'Editar' : 'Criar'} OAC</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para {isEditing ? 'editar' : 'criar'}{' '}
            um
            {!isEditing && ' novo'} OAC.
          </DialogDescription>
        </DialogHeader>
        <OACCreateUpdateForm oac={oac} onClose={onClose} />
      </DialogContent>
    </Dialog>
  )
}
