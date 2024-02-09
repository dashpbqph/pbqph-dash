'use client'

import { Suspense, useState } from 'react'
import { MathJax } from 'better-react-mathjax'

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
import {
  IndicatorValuesWithRelation,
  IndicatorWithRelations,
} from '@/types/indicator'
import { IndicatorDataTableGrid } from '../../IndicatorDataTableGrid'
import { useIndicatorCRUDFormSubmit } from '../../IndicatorDataTableGrid/IndicatorDataTableGrid.hooks'

type IndicatorCRUDDataDialogProps = {
  indicator: IndicatorWithRelations
}

export default function IndicatorCRUDDataDialog({
  indicator,
}: IndicatorCRUDDataDialogProps) {
  const [open, setOpen] = useState(false)
  const [indicatorValues, setIndicatorValues] = useState<
    IndicatorValuesWithRelation[]
  >([])

  const { handleSubmit: submit, isSubmiting } = useIndicatorCRUDFormSubmit({
    indicator,
    onClose: () => null,
  })

  async function handleSubmit() {
    const valuesToSubmit = indicatorValues.map((value) => {
      return { id: value.id, value: value.value, date: value.createdAt }
    })
    console.table(valuesToSubmit)
    await submit(valuesToSubmit)
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
}

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
