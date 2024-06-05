'use client'

import { Polarity } from '@prisma/client'
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import type { IndicatorWithValues } from '@/types/indicator'
import { getChartData } from '@/app/(main)/_utils'

import { reduceMeanFromChartData } from './utils'

const error = console.error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.error = (...args: any) => {
  if (/defaultProps/.test(args[0])) return
  error(...args)
}

const LAG_LIMIT = 5 // last 5 values

type TrendChartProps = {
  indicator: IndicatorWithValues
}

export default function TrendChart({ indicator }: TrendChartProps) {
  if (!indicator) return null

  const { polarity, values } = indicator
  if (!values || values.length === 0) {
    return null
  }

  const pageData = getChartData({ indicator, stratifications: [] })

  const reducedPageData = reduceMeanFromChartData(pageData)
  if (!reducedPageData || reducedPageData.length === 0) return null

  const min = reducedPageData.reduce((acc, cur) => {
    if (cur.mean < acc.mean) return cur
    return acc
  })
  const max = reducedPageData.reduce((acc, cur) => {
    if (cur.mean > acc.mean) return cur
    return acc
  })

  const reducedPageDataSliced =
    reducedPageData && reducedPageData.length > LAG_LIMIT
      ? reducedPageData.slice(-LAG_LIMIT)
      : reducedPageData
  return (
    <ResponsiveContainer width="100%" height="100%" className="flex-1">
      <LineChart
        width={600}
        height={300}
        data={reducedPageDataSliced}
        style={{ cursor: 'pointer' }}
      >
        <XAxis dataKey="period" padding={{ left: 5, right: 20 }} hide />
        <YAxis padding={{ top: 20, bottom: 0 }} hide />
        <Line
          type="monotone"
          dataKey="mean"
          stroke="#6b7280"
          strokeWidth={2.5}
          dot={
            reducedPageData.length > 1
              ? ({ cx, cy, value }) => (
                  <DotIndicator
                    key={cx}
                    min={polarity === Polarity.POSITIVA ? min : max}
                    max={polarity === Polarity.POSITIVA ? max : min}
                    cx={cx}
                    cy={cy}
                    value={value}
                  />
                )
              : undefined
          }
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

type DotIndicatorProps = {
  cx: number
  cy: number
  value: number
  min: { period: string; mean: number }
  max: { period: string; mean: number }
}

function DotIndicator({ cx, cy, value, min, max }: DotIndicatorProps) {
  if (value === min.mean) {
    return (
      <circle
        cy={cy}
        cx={cx}
        r="5"
        type="monotone"
        fill="#F4C000"
        stroke="#0C2E40"
        strokeWidth="1.3"
        className="recharts-dot recharts-l2ne-dot"
      />
    )
  }

  if (value === max.mean) {
    return (
      <circle
        cy={cy}
        cx={cx}
        r="5"
        type="monotone"
        fill="#03979D"
        stroke="#0C2E40"
        strokeWidth="1.3"
        className="recharts-dot recharts-l2ne-dot"
      />
    )
  }
}
