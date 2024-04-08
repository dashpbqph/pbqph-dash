import { ColumnDef } from '@tanstack/react-table'
import { MathJax } from 'better-react-mathjax'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { ptBR } from 'date-fns/locale'
import { ArrowUpDown } from 'lucide-react'

import { TrendChart } from '@/components/dashboard/charts'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { IndicatorWithRelations } from '@/types/indicator'

function ema(values: number[], period: number = 3) {
  if (values.length === 0) {
    return null
  } else if (values.length === 1) {
    return values[0]
  } else if (values.length < period) {
    period = values.length
  }

  const multiplier = 2 / (period + 1)
  let ema = values.slice(0, period).reduce((acc, val) => acc + val, 0) / period

  for (let i = period; i < values.length; i++) {
    ema = (values[i]! - ema) * multiplier + ema
  }

  return ema
}

export const columns: ColumnDef<IndicatorWithRelations>[] = [
  {
    accessorKey: 'code',
    header: ({ column }) => {
      return (
        <div className="flex-1">
          <Button
            variant="ghost"
            className="flex justify-start"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Código
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="min-w-[140px] flex-1 px-4 text-left font-medium">
            <MathJax
              hideUntilTypeset="first"
              inline
              dynamic
              suppressHydrationWarning
            >
              {`\\(${row.getValue('code')}\\)`}
            </MathJax>
          </TooltipTrigger>
          <TooltipContent className="max-w-[400px]" align="start">
            {row.original.name}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    filterFn: (row, _id, value) => {
      const codeAndName = `${row.getValue('code')} ${row.original.name}`
      return codeAndName.includes(value)
    },
  },
  {
    accessorKey: 'system',
    accessorFn: (row) => row.system.code,
    header: () => <div className="hidden">Sistema</div>,
    cell: ({ row }) => (
      <div className="hidden min-w-[140px]">{row.original.system.code}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'category',
    accessorFn: (row) => row.category.name,
    header: () => <div className="hidden">Categoria</div>,
    cell: ({ row }) => (
      <div className="hidden min-w-[140px]">{row.original.category.name}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'ema',
    header: () => (
      <div className="hidden text-center lg:block">Média móvel</div>
    ),
    cell: ({ row }) => {
      const values = row.original.values.map((v) => v.value)
      const emaValue = ema(values)
      return (
        <div className="hidden min-w-[140px] text-center lg:block">
          {emaValue?.toLocaleString('pt-BR', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })}
        </div>
      )
    },
  },
  {
    id: 'lastValue',
    header: () => (
      <div className="hidden text-center lg:block">Último valor</div>
    ),
    cell: ({ row }) => {
      const values = row.original.values
      const lastValue =
        values.length > 0
          ? values.reduce((acc, cur) => {
              if (cur.createdAt > acc.createdAt) return cur
              return acc
            })
          : null
      return (
        <div className="hidden min-w-[140px] text-center lg:block">
          {lastValue?.value.toLocaleString('pt-BR', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })}
        </div>
      )
    },
  },
  {
    accessorKey: 'periodicity',
    header: () => (
      <div className="hidden text-center lg:block">Periodicidade</div>
    ),
    cell: ({ row }) => {
      const lastUpdate = row.original.updatedAt
      return (
        <div className="hidden min-w-[140px] flex-col items-center text-center lg:flex">
          {row.original.periodicity}
          <span className="w-3/4 text-xs text-muted-foreground">
            (atualizado há
            <br />
            {formatDistanceToNow(new Date(lastUpdate), {
              locale: ptBR,
            })}
            )
          </span>
        </div>
      )
    },
  },
  {
    id: 'trend',
    header: () => (
      <div className="hidden w-[360px] lg:block xl:w-[480px] 2xl:w-[600px]">
        Tendência
      </div>
    ),
    cell: ({ row }) => {
      const indicator = row.original
      return (
        <div className="hidden h-[100px] w-[360px] min-w-[180px] lg:block xl:w-[480px] 2xl:w-[600px]">
          <TrendChart indicator={indicator} />
        </div>
      )
    },
  },
]
