'use client'

import distinctColors from 'distinct-colors'
import {
  LineChart as BaseLineChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { IndicatorWithValues } from '@/types/indicator'
import ChartTooltip from './ChartTooltip'

// const pageData = [
//   {
//     date: '2018',
//     'NPNC-Norte': 150,
//     'NPNC-Nordeste': 48,
//     'NPNC-Centro-Oeste': 180,
//     'NPNC-Sul': -123,
//     'NPNC-Sudeste': 90,
//   },
//   {
//     date: '2019',
//     'NPNC-Norte': 200,
//     'NPNC-Nordeste': -78,
//     'NPNC-Centro-Oeste': 140,
//     'NPNC-Sul': -83,
//     'NPNC-Sudeste': 70,
//   },
//   {
//     date: '2020',
//     'NPNC-Norte': 155,
//     'NPNC-Nordeste': 108,
//     'NPNC-Centro-Oeste': 120,
//     'NPNC-Sul': -63,
//     'NPNC-Sudeste': -40,
//   },
//   {
//     date: '2021',
//     'NPNC-Norte': 120,
//     'NPNC-Nordeste': 118,
//     'NPNC-Centro-Oeste': 160,
//     'NPNC-Sul': -43,
//     'NPNC-Sudeste': -100,
//   },
//   {
//     date: '2022',
//     'NPNC-Norte': 90,
//     'NPNC-Nordeste': 168,
//     'NPNC-Centro-Oeste': 190,
//     'NPNC-Sul': -23,
//     'NPNC-Sudeste': 10,
//   },
//   {
//     date: '2023',
//     'NPNC-Norte': 120,
//     'NPNC-Nordeste': 198,
//     'NPNC-Centro-Oeste': 140,
//     'NPNC-Sul': -3,
//     'NPNC-Sudeste': -10,
//   },
// ]

function getMapColors(labels: string[]) {
  const colors = distinctColors({ samples: labels.length })

  return labels.reduce(
    (acc: { [key: string]: { color: string } }, label, index) => {
      const colorIndex = index % colors.length
      acc[label] = { color: colors[colorIndex]!.hex() }
      return acc
    },
    {},
  )
}

// const mapColors = getMapColors([
//   'NPNC-Norte',
//   'NPNC-Nordeste',
//   'NPNC-Centro-Oeste',
//   'NPNC-Sul',
//   'NPNC-Sudeste',
// ])

// TODO:
// 1. Create aux function to format createdAt date to string based on periodicity of the indicator
// 2. Create a function to format the data to the format expected by the chart
// 2.1. The data should be an array of objects, where each object has a date key and a key for each indicator
// 2.2. The data keys should be named by the prefix of the indicator name and the stratifications, if any
//      Example: NPNC-Norte, NPNC-Nordeste (<abbreviated name>-<stratification>)
// 3. Use the abbreviated name of the indicator as prefix for the data keys

// periodicity = [
//   { value: 'mensal', label: 'Mensal' },
//   { value: 'trimestral', label: 'Trimestral' },
//   { value: 'semestral', label: 'Semestral' },
//   { value: 'anual', label: 'Anual' },
//   { value: 'eventual', label: 'Eventual' },
// ]

function formatDateByPeriodicity(date: Date, periodicity: string) {
  const month = date.getMonth()
  if (periodicity === 'mensal') {
    return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
  } else if (periodicity === 'trimestral') {
    const quarter = Math.floor(month / 3) + 1
    return `Q${quarter} ${date.getFullYear()}`
  } else if (periodicity === 'semestral') {
    const semester = Math.floor(month / 6) + 1
    return `S${semester} ${date.getFullYear()}`
  } else if (periodicity === 'anual') {
    return date.toLocaleDateString('pt-BR', { year: 'numeric' })
  }

  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getFormattedData(indicator: IndicatorWithValues) {
  if (indicator?.stratifiedByRegion) {
    return indicator?.values.map((value) => ({
      date: formatDateByPeriodicity(value.createdAt, indicator.periodicity),
      Norte: value.value,
      Nordeste: value.value,
      'Centro-Oeste': value.value,
      Sul: value.value,
      Sudeste: value.value,
    }))
  } else {
    return indicator?.values.map((value) => ({
      date: formatDateByPeriodicity(value.createdAt, indicator.periodicity),
      Indicador: value.value,
    }))
  }
}

type LineChartProps = {
  indicator: IndicatorWithValues
}

export function LineChart({ indicator }: LineChartProps) {
  const pageData = getFormattedData(indicator)
  const mapColors =
    pageData && pageData.length > 0
      ? getMapColors(Object.keys(pageData[0]!).slice(1))
      : {}
  return (
    <ResponsiveContainer width="100%" height="100%" className="flex-1">
      <BaseLineChart width={500} height={300} data={pageData}>
        <CartesianGrid strokeDasharray="5 5" />
        {!pageData ||
          (pageData.length === 0 && (
            <text
              x="50%"
              y="44%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="18"
              fill="#687182"
            >
              Sem dados para exibir
            </text>
          ))}
        <XAxis
          dataKey="date"
          padding={{ left: 20, right: 20 }}
          tick={{ stroke: '#687182', strokeWidth: 0.7, fontSize: 16 }}
        />
        <YAxis
          padding={{ top: 20, bottom: 20 }}
          width={36}
          tick={{ stroke: '#687182', strokeWidth: 0.4, fontSize: 14 }}
          axisLine={false}
        />
        <Tooltip
          wrapperStyle={{ outline: 'none' }}
          isAnimationActive={false}
          cursor={{ stroke: '#d1d5db', strokeWidth: 1 }}
          content={({ active, payload, label }) => (
            <ChartTooltip active={active} payload={payload} label={label} />
          )}
          position={{ y: 0 }}
        />
        <Legend
          iconType="square"
          align="left"
          content={(props) => {
            const { payload } = props
            return (
              <ul className="mt-1.5 flex flex-col gap-4 text-xs font-medium text-[#687182] md:flex-row md:justify-between">
                {mapColors && Object.keys(mapColors).length > 1 && (
                  <div className="flex gap-3 md:w-1/2">
                    <span>Legenda:</span>
                    <div className="flex flex-1 flex-wrap gap-3">
                      {payload?.map((entry, index) => (
                        <li
                          key={`item-${index}`}
                          className="flex items-start gap-1"
                        >
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 10 10"
                            fill={entry.color}
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="10" height="10" />
                          </svg>
                          <span className="whitespace-nowrap">
                            {entry.value}
                          </span>
                        </li>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-1 md:ml-auto md:w-[300px] lg:w-[400px]">
                  <span>Fonte:</span>
                  <span>{indicator?.source}</span>
                </div>
              </ul>
            )
          }}
        />
        {Object.entries(mapColors).map(([key, value]) => (
          <Line
            key={key}
            // type="monotone"
            dataKey={key}
            stroke={value.color}
            strokeWidth={3}
            dot={{ fill: value.color, r: 5 }}
            activeDot={{ fill: value.color, stroke: value.color, r: 6.5 }}
          />
        ))}
      </BaseLineChart>
    </ResponsiveContainer>
  )
}
