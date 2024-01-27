'use client'

import { useState } from 'react'
import { PieChart } from 'lucide-react'

import { DialogCreateUpdateTrigger } from '@/components/shared/dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { IndicatorWithRelations } from '@/types/indicator'
import IndicatorCreateUpdateForm from './IndicatorCreateUpdateForm'

type IndicatorCreateUpdateDialogProps = {
  indicator?: IndicatorWithRelations
  refetchIndicators: () => void
}

export default function IndicatorCreateUpdateDialog({
  indicator,
  refetchIndicators,
}: IndicatorCreateUpdateDialogProps) {
  const isEditing = !!indicator
  const [open, setOpen] = useState(false)

  async function onClose() {
    setOpen(false)
    refetchIndicators()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogCreateUpdateTrigger
        isEditing={isEditing}
        subject="indicador"
        icon={PieChart}
      />
      <DialogContent className="max-w-[425px] p-7 md:max-w-[650px]">
        <DialogHeader className="text-left">
          <DialogTitle>{isEditing ? 'Editar' : 'Criar'} indicador</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para{' '}
            {isEditing ? 'editar o' : 'criar um novo'} indicador.
          </DialogDescription>
        </DialogHeader>
        <IndicatorCreateUpdateForm onClose={onClose} indicator={indicator} />
      </DialogContent>
    </Dialog>
  )
}
