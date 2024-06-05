import { Category, Periodicity, SystemType } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { MathJax } from 'better-react-mathjax'
import { ArrowUpDown } from 'lucide-react'

import { IndicatorWithRelations } from '@/types/indicator'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import TrendChart from '@/app/(main)/_components/trend-chart'
import { getChartData } from '@/app/(main)/_utils'

const CATEGORY_MAP: Record<Category, string> = {
  ESTRATEGICO: 'Estratégico',
  DESEMPENHO: 'Desempenho',
  RESULTADO: 'Resultado',
}

const PERIODICITY_MAP: Record<Periodicity, string> = {
  EVENTUAL: 'Eventual',
  ANUAL: 'Anual',
  SEMESTRAL: 'Semestral',
  TRIMESTRAL: 'Trimestral',
}

const SYSTEM_TYPE_MAP: Record<SystemType, string> = {
  NAO_SE_APLICA: 'Não se aplica',
  CONVENCIONAL: 'Convencional',
  INOVACAO: 'Inovação',
}

export const columns: ColumnDef<IndicatorWithRelations>[] = [
  {
    id: 'description',
    header: ({ column }) => {
      return (
        <div className="flex-1">
          <Button
            variant="ghost"
            className="flex justify-start"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Descrição
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const systemColor =
        row.original.system.abbrev === 'SiAC'
          ? '#701a75'
          : row.original.system.abbrev === 'SiMaC'
            ? '#78350f'
            : row.original.system.abbrev === 'SiNAT'
              ? '#134e4a'
              : '#000'
      return (
        <div className="flex flex-col gap-1 pl-4">
          <MathJax hideUntilTypeset="first" inline dynamic suppressHydrationWarning>
            {`\\(${row.original.codeMathJax}\\)`}
          </MathJax>
          <span className="line-clamp-2 font-light">{row.original.name}</span>
          <div className="flex items-center gap-2">
            <BadgeSystem
              system={row.original.system.abbrev}
              systemType={row.original.systemType}
              colorBadge={systemColor}
            />
            <BadgeCategory category={CATEGORY_MAP[row.original.category]} />
          </div>
        </div>
      )
    },
    filterFn: (row, _id, value) => {
      const codeAndName = `${row.original.code} ${row.original.name}`
      return codeAndName.toLowerCase().includes(value.toLowerCase())
    },
  },
  {
    accessorKey: 'system',
    accessorFn: (row) => row.system.abbrev,
    header: () => <div className="hidden">Sistema</div>,
    cell: ({ row }) => <div className="hidden min-w-[140px]">{row.original.system.abbrev}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'category',
    accessorFn: (row) => row.category,
    header: () => <div className="hidden">Categoria</div>,
    cell: ({ row }) => <div className="hidden min-w-[140px]">{row.original.category}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'lastValue',
    header: () => <div className="hidden text-center lg:block">Último valor</div>,
    cell: ({ row }) => {
      const pageData = getChartData({ indicator: row.original, stratifications: [] })
      const lastValue = pageData.length > 0 ? pageData[pageData.length - 1] : null
      return (
        <div className="hidden min-w-[140px] text-center lg:block">
          {lastValue?.Indicador
            ? lastValue.Indicador.toLocaleString('pt-BR', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })
            : '-'}
        </div>
      )
    },
  },
  {
    accessorKey: 'periodicity',
    header: () => <div className="hidden text-center lg:block">Periodicidade</div>,
    cell: ({ row }) => (
      <div className="hidden min-w-[140px] flex-col items-center text-center lg:flex">
        {PERIODICITY_MAP[row.original.periodicity]}
      </div>
    ),
  },
  {
    id: 'trend',
    header: () => (
      <div className="hidden w-[300px] lg:block xl:w-[360px] 2xl:w-[460px]">
        Tendência <span className="text-xs font-thin">(últimos 5 valores)</span>
      </div>
    ),
    cell: ({ row }) => {
      const indicator = row.original
      return (
        <div className="hidden h-[100px] w-[300px] min-w-[180px] lg:block xl:w-[360px] 2xl:w-[460px]">
          <TrendChart indicator={indicator} />
        </div>
      )
    },
  },
]

function BadgeSystem({
  system,
  systemType,
  colorBadge,
}: {
  system: string
  systemType: SystemType
  colorBadge: string
}) {
  return (
    <span
      className={cn(
        'h-5 w-fit rounded-lg px-2 py-1 text-xxs',
        system === 'SiAC - Execução de Obras' && '#4a044e',
        system === 'SiMaC' && 'bg-amber-800',
        system === 'SiNAT' && 'bg-teal-800',
      )}
      style={{ color: 'white', backgroundColor: colorBadge }}
    >
      {systemType !== SystemType.NAO_SE_APLICA
        ? `${system} - ${SYSTEM_TYPE_MAP[systemType]}`
        : system}
    </span>
  )
}

function BadgeCategory({ category }: { category: string }) {
  return (
    <span
      className={cn(
        'h-5 w-fit rounded-lg px-2 py-1 text-xxs',
        category === 'Estratégico' && 'bg-yellow-700',
        category === 'Desempenho' && 'bg-blue-800',
        category === 'Resultado' && 'bg-rose-900',
      )}
      style={{ color: 'white' }}
    >
      {category}
    </span>
  )
}
