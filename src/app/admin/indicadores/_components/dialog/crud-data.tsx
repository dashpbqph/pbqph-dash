/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { forwardRef, useState } from 'react'

import { IndicatorValuesWithRelation, IndicatorWithRelations } from '@/types/indicator'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import Spinner from '@/components/ui/spinner'
import Markdown from '@/app/_providers/markdown-provider'

import { useIndicatorCRUDFormSubmit } from './data-table-grid/hooks'
import IndicatorDataTableGrid from './data-table-grid/table'

type IndicatorCRUDDataDialogProps = {
  indicator: IndicatorWithRelations
  className?: string
}

const IndicatorCRUDDataDialog = forwardRef<HTMLElement, IndicatorCRUDDataDialogProps>(
  ({ indicator, className }, ref) => {
    const [open, setOpen] = useState(false)
    const [indicatorValues, setIndicatorValues] = useState<IndicatorValuesWithRelation[]>([])

    const { handleSubmit: submit, isSubmiting } = useIndicatorCRUDFormSubmit({
      indicator,
      onClose: () => null,
    })

    async function handleSubmit() {
      const valuesToSubmit = indicatorValues.map((value) => {
        return {
          id: value.id,
          value: value.value,
          date: value.createdAt,
          oac: value.oacId,
          psq: value.psqId,
          guideline: value.guidelineId,
          region: value.region,
          company: value.companyId,
          project: value.projectId,
        }
      })
      await submit(valuesToSubmit)
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className={cn('w-full hover:bg-accent', className)}>
          Editar dados
        </DialogTrigger>
        <DialogContent className="flex w-fit max-w-fit flex-col p-7">
          <DialogHeader className="text-left">
            <DialogTitle>Editar dados do indicador</DialogTitle>
            <DialogDescription>
              Preencha as informações abaixo para editar os dados do indicador{' '}
              <Markdown>{`${indicator?.codeMarkdown}`}</Markdown> .
            </DialogDescription>
          </DialogHeader>
          <IndicatorDataTableGrid
            indicator={indicator}
            indicatorValues={indicatorValues}
            setIndicatorValues={setIndicatorValues}
          />
          <DialogFooter>
            <Button
              type="button"
              className="flex w-full flex-row gap-2 data-[loading=true]:cursor-not-allowed"
              onClick={handleSubmit}
              data-loading={isSubmiting}
              disabled={isSubmiting}
            >
              {isSubmiting && <Spinner />}
              {isSubmiting ? 'Processando...' : `Editar dados do indicador`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
)
IndicatorCRUDDataDialog.displayName = 'IndicatorCRUDDataDialog'

export default IndicatorCRUDDataDialog
