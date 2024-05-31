/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { forwardRef, Suspense, useState } from 'react'
import { MathJax } from 'better-react-mathjax'

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
              <MathJax hideUntilTypeset="first" inline dynamic suppressHydrationWarning>
                {`\\(${indicator?.codeMathJax}\\)`}
              </MathJax>{' '}
              .
            </DialogDescription>
          </DialogHeader>
          <Suspense fallback={<SkeletonTable />}>
            <IndicatorDataTableGrid
              indicator={indicator}
              indicatorValues={indicatorValues}
              setIndicatorValues={setIndicatorValues}
            />
          </Suspense>
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

function SkeletonTable() {
  return (
    <div className="flex h-[240px] w-full flex-col gap-4">
      <div className="flex h-8 w-full justify-end">
        <div className="w-[140px] animate-pulse rounded-md bg-gray-200" />
      </div>
      <div className="w-full flex-1 animate-pulse rounded-md bg-gray-200" />
      <div className="flex h-8 w-full justify-between gap-2">
        <div className="w-[140px] animate-pulse rounded-md bg-gray-200" />
        <div className="w-[240px] animate-pulse rounded-md bg-gray-200" />
      </div>
    </div>
  )
}
