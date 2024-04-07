'use client'

import {
  LineChart as BaseLineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

import type { IndicatorValue } from '@/types/indicator'

function getPageData(values: IndicatorValue[]) {
  const valuesSorted = values.sort((a, b) =>
    a.createdAt > b.createdAt ? 1 : -1,
  )
  return valuesSorted.map((value, index) => ({
    label: index.toString(),
    value: value.value,
  }))
}

const error = console.error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.error = (...args: any) => {
  if (/defaultProps/.test(args[0])) return
  error(...args)
}

type TrendChartProps = {
  values: IndicatorValue[]
  polarity: string
}

export function TrendChart({ values, polarity }: TrendChartProps) {
  if (!values || values.length === 0) {
    return null
  }

  const pageData = getPageData(values)

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
