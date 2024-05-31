/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { forwardRef, useState } from 'react'

import type { IndicatorWithRelations } from '@/types/indicator'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import DialogCreateUpdateTrigger from '@/app/admin/_components/create-update-trigger'

import IndicatorCreateUpdateForm from './form'

type IndicatorCreateUpdateDialogProps = {
  indicator?: IndicatorWithRelations
  refetchIndicators: () => void
  className?: string
}

const IndicatorCreateUpdateDialog = forwardRef<HTMLElement, IndicatorCreateUpdateDialogProps>(
  ({ indicator, refetchIndicators, className }, ref) => {
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
          className={cn(isEditing && 'w-full hover:bg-accent', className)}
        />
        <DialogContent className="max-w-[425px] p-7 md:max-w-[650px]">
          <DialogHeader className="text-left">
            <DialogTitle>{isEditing ? 'Editar' : 'Criar'} indicador</DialogTitle>
            <DialogDescription>
              Preencha as informações abaixo para {isEditing ? 'editar o' : 'criar um novo'}{' '}
              indicador.
            </DialogDescription>
          </DialogHeader>
          <IndicatorCreateUpdateForm onClose={onClose} indicator={indicator} />
        </DialogContent>
      </Dialog>
    )
  },
)

IndicatorCreateUpdateDialog.displayName = 'IndicatorCreateUpdateDialog'

export default IndicatorCreateUpdateDialog
