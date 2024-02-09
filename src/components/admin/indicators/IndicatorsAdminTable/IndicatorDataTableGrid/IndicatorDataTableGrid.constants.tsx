import { ColumnDef } from '@tanstack/react-table'
import { MathJax } from 'better-react-mathjax'
import { format, getMonth, getQuarter } from 'date-fns'
import { Check, Pencil, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { IndicatorValuesWithRelation } from '@/types/indicator'

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

type GetColumnsProps = {
  idEditValues: string[]
  setIdEditValues: (ids: string[]) => void
  indicatorValues: IndicatorValuesWithRelation[]
  setIndicatorValues: (values: IndicatorValuesWithRelation[]) => void
  idDeleteValues: string[]
  setIdDeleteValues: (ids: string[]) => void
  refetchIndicators: () => void
}

export const getColumns = ({
  idEditValues,
  setIdEditValues,
  indicatorValues,
  idDeleteValues,
  setIdDeleteValues,
  setIndicatorValues,
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
        const date = row.original.createdAt
        return (
          <div className="min-w-[240px] pl-4 text-left">
            {isEditing ? (
              <Input
                type="date"
                className="w-36 items-center border-none shadow-none"
                defaultValue={format(row.original.createdAt, 'yyyy-MM-dd')}
                max={format(new Date(), 'yyyy-MM-dd')}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onChange={(e) => {
                  e.preventDefault()
                  const newValue = e.target.value
                  const newValues = indicatorValues.map((value) => {
                    if (value.id === indicatorValue.id) {
                      return {
                        ...value,
                        createdAt: new Date(newValue + 'T00:00:00'),
                      }
                    }
                    return value
                  })
                  setIndicatorValues(newValues)
                }}
              />
            ) : (
              <>
                {periodicity !== 'ano' && (
                  <>
                    <span>{periodFn(row.original.createdAt)}</span>º{' '}
                    <span>{periodicity}</span> de{' '}
                  </>
                )}
                <span>{format(date, 'yyyy')}</span>
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
          <div className="flex min-w-[140px] justify-center gap-1 text-center">
            {isEditing ? (
              <Input
                type="number"
                className="w-20 border-none text-center shadow-none"
                defaultValue={row.getValue('value')}
                step={0.1}
                onChange={(e) => {
                  e.preventDefault()
                  const newValue = e.target.value
                  const newValues = indicatorValues.map((value) => {
                    if (value.id === indicatorValue.id) {
                      return { ...value, value: parseFloat(newValue) }
                    }
                    return value
                  })
                  setIndicatorValues(newValues)
                }}
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
      id: 'actions',
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
            <Button
              variant="outline"
              className="aspect-square p-1"
              onClick={() => {
                setIdDeleteValues([...idDeleteValues, indicatorValue.id])
                setIndicatorValues(
                  indicatorValues.filter(
                    (value) => value.id !== indicatorValue.id,
                  ),
                )
              }}
            >
              <Trash className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )
      },
    },
  ]
}
