import { ColumnDef } from '@tanstack/react-table'
import { MathJax } from 'better-react-mathjax'
import { format, getMonth, getQuarter } from 'date-fns'
import { Check, Pencil, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { IndicatorValuesWithRelation } from '@/types/indicator'

type GetColumnsProps = {
  idEditValues: string[]
  setIdEditValues: (ids: string[]) => void
  refetchIndicators: () => void
}

const mapPeriod = {
  anual: 'ano',
  mensal: 'mês',
  bimestral: 'bimestre',
  trimestral: 'trimestre',
  semestral: 'semestre',
}

const mapPeriodFn = {
  anual: (date: Date) => getQuarter(date),
  mensal: (date: Date) => getMonth(date) + 1, // Adiciona 1 pois os meses começam de 0
  bimestral: (date: Date) => getQuarter(date) * 2,
  trimestral: (date: Date) => getQuarter(date),
  semestral: (date: Date) => Math.ceil(getMonth(date) / 6), // Divide por 6 e arredonda para cima
}

export const getColumns = ({
  idEditValues,
  setIdEditValues,
  refetchIndicators,
}: GetColumnsProps): ColumnDef<IndicatorValuesWithRelation>[] => {
  return [
    {
      id: 'period',
      header: () => <div className="pl-4">Período</div>,
      cell: ({ row }) => {
        const indicatorValue = row.original
        const isEditing = idEditValues.includes(indicatorValue.id)
        const periodicity =
          mapPeriod[
            indicatorValue.indicator.periodicity as keyof typeof mapPeriod
          ]
        const periodFn =
          mapPeriodFn[
            indicatorValue.indicator.periodicity as keyof typeof mapPeriodFn
          ]
        const year = format(row.original.createdAt, 'yyyy')
        return (
          <div className="min-w-[240px] pl-4 text-left">
            {isEditing ? (
              <input
                type="date"
                className="w-32"
                defaultValue={format(row.original.createdAt, 'yyyy-MM-dd')}
                max={format(new Date(), 'yyyy-MM-dd')}
              />
            ) : (
              <>
                {periodicity !== 'ano' && (
                  <>
                    <span>{periodFn(row.original.createdAt)}</span>º{' '}
                    <span>{periodicity}</span> de{' '}
                  </>
                )}
                <span>{year}</span>
              </>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'value',
      header: () => <div className="hidden text-center lg:block">Valor</div>,
      cell: ({ row }) => {
        const indicatorValue = row.original
        const isEditing = idEditValues.includes(indicatorValue.id)
        const unit = row.original.indicator.unit
        return (
          <div className="min-w-[140px] gap-1 text-center">
            {isEditing ? (
              <input
                type="number"
                className="w-20 text-center"
                defaultValue={row.getValue('value')}
                step={0.1}
              />
            ) : (
              (row.getValue('value') as number).toLocaleString('pt-BR')
            )}{' '}
            {!['absoluta', 'adimensional'].includes(unit) && (
              <MathJax
                hideUntilTypeset="first"
                inline
                dynamic
                suppressHydrationWarning
              >
                {`\\(${unit}\\)`}
              </MathJax>
            )}
          </div>
        )
      },
    },
    {
      id: 'delete',
      enableHiding: false,
      cell: ({ row }) => {
        const indicatorValue = row.original
        const isEditing = idEditValues.includes(indicatorValue.id)
        const Icon = isEditing ? Check : Pencil
        return (
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="outline"
              className="aspect-square p-1"
              onClick={() =>
                setIdEditValues(
                  // if the id is already in the array,
                  // remove it, otherwise add it
                  isEditing
                    ? idEditValues.filter((id) => id !== indicatorValue.id)
                    : [...idEditValues, indicatorValue.id],
                )
              }
            >
              <Icon
                className="h-4 w-4 text-blue-500 data-[editing=true]:text-green-500"
                data-editing={isEditing}
              />
            </Button>
            <Button variant="outline" className="aspect-square p-1">
              <Trash className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )
      },
    },
  ]
}
