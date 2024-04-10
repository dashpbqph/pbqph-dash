'use client'

import {
  LineChart as BaseLineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

import type { IndicatorWithValues } from '@/types/indicator'

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

type IndicatorValuesGroupedByRegion = {
  date: string
  NORTE?: number | null
  NORDESTE?: number | null
  CENTRO_OESTE?: number | null
  SUDESTE?: number | null
  SUL?: number | null
}

function calculateMean(values: (number | null)[]): number {
  const filteredValues = values.filter(
    (value): value is number => value !== null,
  )
  return filteredValues.length > 0
    ? filteredValues.reduce((sum, value) => sum + value, 0) /
        filteredValues.length
    : 0
}

function getFormattedData(indicator: IndicatorWithValues) {
  if (indicator?.stratifiedByRegion) {
    const indicatorValues = indicator.values.map((value) => ({
      date: formatDateByPeriodicity(value.createdAt, indicator.periodicity),
      region: value.region,
      value: value.value,
    }))
    const groupedByDate: { [key: string]: IndicatorValuesGroupedByRegion } = {}
    indicatorValues.forEach(({ date, region, value }) => {
      if (!groupedByDate[date]) {
        groupedByDate[date] = {
          date,
          NORTE: null,
          NORDESTE: null,
          SUL: null,
          SUDESTE: null,
          CENTRO_OESTE: null,
        }
      }
      if (region) {
        groupedByDate[date]![region] = value
      }
    })
    return Object.values(groupedByDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(({ date, ...regions }) => ({
        label: date,
        value: calculateMean(Object.values(regions)),
      }))
  } else {
    return indicator?.values
      .map((value) => ({
        label: formatDateByPeriodicity(value.createdAt, indicator.periodicity),
        value: value.value,
      }))
      .sort((a, b) => new Date(a.label).getTime() - new Date(b.label).getTime())
  }
}

const error = console.error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.error = (...args: any) => {
  if (/defaultProps/.test(args[0])) return
  error(...args)
}

type TrendChartProps = {
  indicator: IndicatorWithValues
}

export function TrendChart({ indicator }: TrendChartProps) {
  if (!indicator) return null

  const { polarity, values } = indicator
  if (!values || values.length === 0) {
    return null
  }

  const pageData = getFormattedData(indicator)
  if (!pageData || pageData.length === 0) return null

  const min = pageData.reduce((acc, cur) => {
    if (cur.value < acc.value) return cur
    return acc
  })
  const max = pageData.reduce((acc, cur) => {
    if (cur.value > acc.value) return cur
    return acc
  })
  return (
    <ResponsiveContainer width="100%" height="100%" className="flex-1">
      <BaseLineChart
        width={600}
        height={300}
        data={pageData}
        style={{ cursor: 'pointer' }}
      >
        <XAxis dataKey="label" padding={{ left: 0, right: 20 }} hide />
        <YAxis padding={{ top: 20, bottom: 0 }} hide />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#6b7280"
          strokeWidth={2.5}
          dot={
            pageData.length > 1
              ? ({ cx, cy, value }) => (
                  <CustomDot
                    key={cx}
                    min={polarity === 'positiva' ? min : max}
                    max={polarity === 'positiva' ? max : min}
                    cx={cx}
                    cy={cy}
                    value={value}
                  />
                )
              : undefined
          }
        />
      </BaseLineChart>
    </ResponsiveContainer>
  )
}

type CustomDotProps = {
  cx: number
  cy: number
  value: number
  min: { label: string; value: number }
  max: { label: string; value: number }
}

function CustomDot({ cx, cy, value, min, max }: CustomDotProps) {
  if (value === min.value) {
    return (
      <circle
        cy={cy}
        cx={cx}
        r="5"
        type="monotone"
        fill="red"
        className="recharts-dot recharts-l2ne-dot"
        strokeWidth="3"
      />
    )
  }

  if (value === max.value) {
    return (
      <circle
        cy={cy}
        cx={cx}
        r="5"
        type="monotone"
        fill="green"
        className="recharts-dot recharts-l2ne-dot"
        strokeWidth="3"
      />
    )
  }
}
