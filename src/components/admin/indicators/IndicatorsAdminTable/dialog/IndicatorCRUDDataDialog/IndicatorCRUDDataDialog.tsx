import { useState } from 'react'
import { MathJax } from 'better-react-mathjax'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { IndicatorWithRelations } from '@/types/indicator'
import { IndicatorDataTableGrid } from '../../IndicatorDataTableGrid'

type IndicatorCRUDDataDialogProps = {
  indicator?: IndicatorWithRelations
  refetchIndicators: () => void
}

export default function IndicatorCRUDDataDialog({
  indicator,
  refetchIndicators,
}: IndicatorCRUDDataDialogProps) {
  const [open, setOpen] = useState(false)

  async function onSubmit() {
    setOpen(false)
    refetchIndicators()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Editar dados</DialogTrigger>
      <DialogContent className="max-w-[425px] p-7 md:max-w-[650px]">
        <DialogHeader className="text-left">
          <DialogTitle>Editar dados do indicador</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para editar os dados do indicador{' '}
            <MathJax
              hideUntilTypeset="first"
              inline
              dynamic
              suppressHydrationWarning
            >
              {`\\(${indicator?.code}\\)`}
            </MathJax>{' '}
            .
          </DialogDescription>
        </DialogHeader>
        <IndicatorDataTableGrid indicator={indicator} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  )
}
