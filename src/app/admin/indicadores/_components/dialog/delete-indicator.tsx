/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, useState } from 'react'
import { api } from '@/trpc/react'
import { MathJax } from 'better-react-mathjax'

import type { IndicatorWithRelations } from '@/types/indicator'
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

type IndicatorDeleteDialogProps = {
  indicator: IndicatorWithRelations
  refetchIndicators: () => void
  className?: string
}

const IndicatorDeleteDialog = forwardRef<HTMLElement, IndicatorDeleteDialogProps>(
  ({ indicator, refetchIndicators, className }, ref) => {
    const [open, setOpen] = useState(false)
    const { mutateAsync: deleteIndicator, isPending } = api.indicator.delete.useMutation({
      onSuccess: () => {
        refetchIndicators()
        setOpen(false)
      },
    })

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger className={cn('w-full hover:bg-accent', className)}>
          Remover indicador
        </AlertDialogTrigger>
        <AlertDialogContent className="space-y-2 bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Deseja realmente remover o indicador{' '}
              <MathJax hideUntilTypeset="first" inline dynamic>
                {`\\(${indicator.codeMathJax}\\)`}
              </MathJax>
              ?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xl-1">
              Esta ação não pode ser desfeita. Isso vai remover permanentemente o indicador e todos
              os seus respectivos dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-0">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <DialogDeleteButton
              isLoading={isPending}
              deleteFn={() => deleteIndicator({ id: indicator.id })}
            />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
)
IndicatorDeleteDialog.displayName = 'IndicatorDeleteDialog'

export default IndicatorDeleteDialog
