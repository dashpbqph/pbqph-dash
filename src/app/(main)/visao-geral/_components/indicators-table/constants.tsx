import { Category, Group, Periodicity, Polarity, SystemType } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, TrendingDown, TrendingUp } from 'lucide-react'

import { IndicatorWithRelations } from '@/types/indicator'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Markdown from '@/app/_providers/markdown-provider'
import { getChartData } from '@/app/(main)/_utils'

const CATEGORY_MAP: Record<Category, string> = {
  [Category.ESTRATEGICO]: 'Estratégico',
  [Category.DESEMPENHO]: 'Desempenho',
  [Category.RESULTADO]: 'Resultado',
}

const PERIODICITY_MAP: Record<Periodicity, string> = {
  [Periodicity.EVENTUAL]: 'Eventual',
  [Periodicity.ANUAL]: 'Anual',
  [Periodicity.SEMESTRAL]: 'Semestral',
  [Periodicity.TRIMESTRAL]: 'Trimestral',
  [Periodicity.MENSAL]: 'Mensal',
}

const SYSTEM_TYPE_MAP: Record<SystemType, string> = {
  [SystemType.NAO_SE_APLICA]: 'Não se aplica',
  [SystemType.CONVENCIONAL]: 'Convencional',
  [SystemType.INOVACAO]: 'Inovação',
}

const GROUP_MAP: Record<Group, string> = {
  [Group.OBRA]: 'Obra',
  [Group.EMPRESA]: 'Empresa',
  [Group.CONJUNTO_EMPRESAS]: 'Conjunto de Empresas',
}

export const columns: ColumnDef<IndicatorWithRelations>[] = [
  {
    id: 'description',
    header: ({ column }) => {
      return (
        <div className="flex-1">
          <Button
            variant="ghost"
            className="flex justify-start hover:bg-transparent hover:text-accent"
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
        <div className="flex h-[100px] flex-col justify-center gap-1 pl-4">
          <Markdown>{`${row.original.codeMarkdown}`}</Markdown>
          <span className="line-clamp-2 font-light">{row.original.name}</span>
          <div className="flex items-center gap-2">
            <BadgeSystem
              system={row.original.system.abbrev}
              systemType={row.original.systemType}
              colorBadge={systemColor}
            />
            <BadgeCategory category={CATEGORY_MAP[row.original.category]} />
            {row.original.group && <BadgeGroup group={row.original.group} />}
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
    accessorKey: 'group',
    accessorFn: (row) => row.group,
    header: () => <div className="hidden">Agrupamento</div>,
    cell: ({ row }) => {
      return <div className="hidden min-w-[140px]">{row.original.group}</div>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
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
    accessorKey: 'polarity',
    header: () => <div className="hidden text-center lg:block">Polaridade</div>,
    cell: ({ row }) => (
      <div className="hidden min-w-[140px] flex-col items-center text-center lg:flex">
        {row.original.polarity === Polarity.POSITIVA ? (
          <TrendingUp className="h-5 w-5" />
        ) : (
          <TrendingDown className="h-5 w-5" />
        )}
      </div>
    ),
  },
  {
    id: 'lastValue',
    header: () => <div className="hidden text-center lg:block">Último valor</div>,
    cell: ({ row }) => {
      const pageData = getChartData({ indicator: row.original, stratifications: [] })
      const lastValue = pageData.length > 0 ? pageData[pageData.length - 1] : null
      const lastValueFormatted = lastValue?.Indicador
        ? row.original.unit === '%'
          ? (Number(lastValue.Indicador) * 100).toLocaleString('pt-BR', {
              minimumFractionDigits: row.original.decimalPlaces,
              maximumFractionDigits: row.original.decimalPlaces,
            })
          : lastValue.Indicador.toLocaleString('pt-BR', {
              minimumFractionDigits: row.original.decimalPlaces,
              maximumFractionDigits: row.original.decimalPlaces,
            })
        : null

      return (
        <div className="hidden min-w-[160px] text-center lg:block">
          {lastValueFormatted ? (
            <span className="flex items-center justify-center gap-1">
              {lastValueFormatted}
              {!['absoluta', 'adimensional'].includes(row.original.unit) &&
                (row.original.unit === '%' ? (
                  '%'
                ) : (
                  <Markdown className="text-xs text-black">{`$${row.original.unit}$`}</Markdown>
                ))}
            </span>
          ) : (
            '-'
          )}
        </div>
      )
    },
  },
  {
    id: 'minValue',
    header: () => <div className="hidden text-center lg:block">Mínimo</div>,
    cell: ({ row }) => {
      const pageData = getChartData({ indicator: row.original, stratifications: [] })
      const minValue =
        pageData.length > 0
          ? pageData.reduce((acc, cur) => {
              if (cur.Indicador! < acc.Indicador!) return cur
              return acc
            })
          : null
      const minValueFormatted = minValue?.Indicador?.toLocaleString('pt-BR', {
        minimumFractionDigits: row.original.decimalPlaces,
        maximumFractionDigits: row.original.decimalPlaces,
      })

      return (
        <div className="hidden min-w-[160px] text-center lg:block">
          {minValueFormatted ? (
            <span className="flex items-center justify-center gap-1">
              {minValueFormatted}
              {!['absoluta', 'adimensional'].includes(row.original.unit) &&
                (row.original.unit === '%' ? (
                  '%'
                ) : (
                  <Markdown className="text-xs text-black">{`$${row.original.unit}$`}</Markdown>
                ))}
            </span>
          ) : (
            '-'
          )}
          <span className="text-xs text-gray-500">
            {minValue?.period ? `(${minValue.period})` : ''}
          </span>
        </div>
      )
    },
  },
  {
    id: 'maxValue',
    header: () => <div className="hidden text-center lg:block">Máximo</div>,
    cell: ({ row }) => {
      const pageData = getChartData({ indicator: row.original, stratifications: [] })
      const maxValue =
        pageData.length > 0
          ? pageData.reduce((acc, cur) => {
              if (cur.Indicador! > acc.Indicador!) return cur
              return acc
            })
          : null
      const maxValueFormatted = maxValue?.Indicador?.toLocaleString('pt-BR', {
        minimumFractionDigits: row.original.decimalPlaces,
        maximumFractionDigits: row.original.decimalPlaces,
      })

      return (
        <div className="hidden min-w-[160px] text-center lg:block">
          {maxValueFormatted ? (
            <span className="flex items-center justify-center gap-1">
              {maxValueFormatted}
              {!['absoluta', 'adimensional'].includes(row.original.unit) &&
                (row.original.unit === '%' ? (
                  '%'
                ) : (
                  <Markdown className="text-xs text-black">{`$${row.original.unit}$`}</Markdown>
                ))}
            </span>
          ) : (
            '-'
          )}
          <span className="text-xs text-gray-500">
            {maxValue?.period ? `(${maxValue.period})` : ''}
          </span>
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

function BadgeGroup({ group }: { group: Group }) {
  return (
    <span
      className="h-5 w-fit rounded-lg bg-gray-800 px-2 py-1 text-xxs"
      style={{ color: 'white' }}
    >
      {GROUP_MAP[group]}
    </span>
  )
}
