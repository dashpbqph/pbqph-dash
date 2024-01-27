import { useState } from 'react'
import { api } from '@/trpc/react'
import { MathJax } from 'better-react-mathjax'

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
import type { IndicatorWithRelations } from '@/types/indicator'

type IndicatorDeleteDialogProps = {
  indicator: IndicatorWithRelations
  refetchIndicators: () => void
}

export default function IndicatorDeleteDialog({
  indicator,
  refetchIndicators,
}: IndicatorDeleteDialogProps) {
  const [open, setOpen] = useState(false)
  const { mutateAsync: deleteIndicator, isLoading } =
    api.indicator.delete.useMutation({
      onSuccess: () => {
        refetchIndicators()
        setOpen(false)
      },
    })
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>Remover indicador</AlertDialogTrigger>
      <AlertDialogContent className="space-y-2 bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Deseja realmente remover o indicador{' '}
            <MathJax hideUntilTypeset="first" inline dynamic>
              {`\\(${indicator.code}\\)`}
            </MathJax>
            ?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xl-1">
            Esta ação não pode ser desfeita. Isso vai remover permanentemente o
            indicador e todos os seus respectivos dados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-0">
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <DialogButtonDelete
            isLoading={isLoading}
            deleteFn={() => deleteIndicator({ id: indicator.id })}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
