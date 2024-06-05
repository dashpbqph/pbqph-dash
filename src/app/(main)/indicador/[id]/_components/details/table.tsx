import { Fragment } from 'react'

import { IndicatorWithValues } from '@/types/indicator'
import { cn } from '@/lib/utils'

const PSQs = [
  'Aparelhos Economizadores de Água',
  'Argamassa Colante',
  'Blocos Cerâmicos',
  'Blocos Vazados de Concreto com Função Estrutural e Peças de Concreto para Pavimentação',
  'Cimento Portland',
  'Componentes para Sistemas Construtivos em Chapas de Gesso para Drywall',
  'Eletrodutos Plásticos para Sistemas Elétricos de Baixa Tensão em Edificações',
  'Esquadrias de PVC',
  'Fechaduras',
  'Louças Sanitárias para Sistemas Prediais',
  'Metais Sanitários',
  'Painéis de Partículas de Madeira (MDP) e Painéis de Fibras de Madeira (MDF)',
  'Pisos Laminados Fornecidos em Réguas',
  'Placas Cerâmicas para Revestimento',
  'Portas e Janelas de Correr de Alumínio',
  'Reservatórios Poliolefínicos para Água Potável de Volume até 3.000 L (inclusive)',
  'Telhas Cerâmicas',
  'Tintas Imobiliárias',
  'Tubos de PVC para Infraestrutura',
  'Tubos e Conexões de PVC para Sistemas Hidráulicos Prediais',
]

interface TransformedData {
  [year: number]: {
    [quarter: number]: {
      [psq: string]: number
    }
  }
}

function getTableData(indicator: IndicatorWithValues): TransformedData {
  const transformedData: TransformedData = {}

  indicator?.values.forEach((value) => {
    const year = value.createdAt.getFullYear()
    const quarter = Math.ceil((value.createdAt.getMonth() + 1) / 3)
    const psqName = value.psq!.name

    if (!transformedData[year]) {
      transformedData[year] = {
        1: {},
        2: {},
        3: {},
        4: {},
      }
    }

    if (!transformedData[year]![quarter]) {
      transformedData[year]![quarter] = {}
    }

    transformedData[year]![quarter]![psqName] = value.value
  })

  return transformedData
}

type DetailsTableProps = {
  indicator: IndicatorWithValues
}

export default function DetailsTable({ indicator }: DetailsTableProps) {
  const data = getTableData(indicator)
  return (
    <table className="w-full">
      <TableHeader data={data} />
      <tbody>
        {PSQs.map((psq, index) => (
          <TableRow key={index} psq={psq} data={data} />
        ))}
      </tbody>
    </table>
  )
}

interface TableCellProps {
  borderRight?: boolean
  separator?: boolean
  borderDashed?: boolean
  sticky?: boolean
  className?: string
  classNameWrapper?: string
}

export const TableCell = ({
  borderRight = false,
  separator = false,
  borderDashed = false,
  sticky = false,
  className,
  classNameWrapper,
  children,
}: React.PropsWithChildren<TableCellProps>) => {
  return (
    <td
      className={cn(
        'artificial-border relative overflow-hidden bg-primary px-1 py-2',
        borderRight && 'after:border-r',
        borderDashed && 'after:border-dashed',
        sticky && 'sticky left-0 z-10',
        className,
      )}
    >
      {separator && <div className="absolute right-0 top-0 z-10 h-full w-[1px] bg-white" />}
      <div className={cn('w-full text-center text-xs font-light', classNameWrapper)}>
        {children}
      </div>
    </td>
  )
}

export const TableHeader = ({ data }: { data: TransformedData }) => {
  const years = Object.keys(data)
  return (
    <thead className="sticky top-0 z-30">
      <tr>
        <TableCell
          className="z-20 bg-primary pl-4 pr-72"
          classNameWrapper="text-left text-base font-semibold text-white"
          borderRight
          sticky
        >
          PSQ
        </TableCell>
        {years.map((year, index) => (
          <th
            key={index}
            colSpan={4}
            className={cn(
              'artificial-border relative bg-primary px-24 py-2 text-white after:z-10 after:border-r',
            )}
          >
            {year}
          </th>
        ))}
      </tr>
    </thead>
  )
}

const TableRow = ({ psq, data }: { psq: string; data: TransformedData }) => {
  const getColor = (percentage: number) => {
    if (percentage < 0.75) return 'red'
    if (percentage < 0.8) return 'yellow'
    return 'green'
  }

  const MAP_COLORS_CLASS = {
    gray: 'bg-gray-200 text-gray-600',
    green: 'bg-green-200 text-green-800',
    red: 'bg-red-200 text-red-800',
    yellow: 'bg-yellow-200 text-yellow-800',
  }

  return (
    <tr>
      <TableCell
        className="group z-20 bg-primary px-4"
        classNameWrapper="text-left text-white text-xs font-normal group-hover:line-clamp-none line-clamp-1"
        borderRight
        sticky
      >
        {psq}
      </TableCell>
      {Object.keys(data).map((year) => (
        <Fragment key={year}>
          {Object.keys(data[year as unknown as number]!).map((quarter) => {
            const value =
              data[year as unknown as number]![quarter as unknown as number]![psq] || -999
            const color = value === -999 ? 'gray' : getColor(value / 100)
            return (
              <TableCell
                key={`${year}-${quarter}`}
                className={cn(MAP_COLORS_CLASS[color], 'after:z-10')}
                classNameWrapper={cn('font-semibold', value === -999 && 'px-3')}
                borderRight
                borderDashed
                separator={(quarter as unknown as number) === 3}
              >
                {value === -999
                  ? '-'
                  : `${value.toLocaleString('pt-BR', {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}%`}
              </TableCell>
            )
          })}
        </Fragment>
      ))}
    </tr>
  )
}
