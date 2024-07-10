'use client'

import { useState } from 'react'
import chroma from 'chroma-js'
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

import { ChartDataItem } from '@/types/chart'
import type { IndicatorWithValues } from '@/types/indicator'
import { cn } from '@/lib/utils'

import ChartTooltip from './tooltip'

// Override console.error
// This is a hack to suppress the warning about missing defaultProps in recharts library
// @link https://github.com/recharts/recharts/issues/3615
const error = console.error
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return
  error(...args)
}

function getColorMap(labels: string[]) {
  const colors = chroma.scale(['#03979D', '#0067B1', '#0C2E40', '#F4C000']).colors(labels.length)

  return labels.reduce((acc: { [key: string]: string }, label, index) => {
    const colorIndex = index % colors.length
    acc[label] = colors[colorIndex]!
    return acc
  }, {})
}

type LineChartProps = {
  indicator: IndicatorWithValues
  chartData: ChartDataItem[]
  lagLimit?: number
  className?: string
}

export function LineChart({ indicator, chartData, className, lagLimit = 5 }: LineChartProps) {
  const [selectedLine, setSelectedLine] = useState<string | null>(null)
  const colorMap =
    chartData && chartData.length > 0
      ? getColorMap(Object.keys(chartData[0]!).filter((key) => key !== 'period'))
      : {}
  const chartDataSliced = chartData.length > lagLimit ? chartData.slice(-lagLimit) : chartData
  const isStratified = chartData && chartData.length > 0 && !('Indicador' in chartData[0]!)
  return (
    <ResponsiveContainer width="100%" height="100%" className={cn('flex-1', className)}>
      <BaseLineChart width={500} height={300} data={chartDataSliced} id="historical-chart">
        <CartesianGrid strokeDasharray="5 5" />
        {!chartData ||
          (chartData.length === 0 && (
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
          dataKey="period"
          padding={{ left: 20, right: 20 }}
          tick={{ stroke: '#687182', strokeWidth: 0.7, fontSize: 16 }}
        />
        <YAxis
          padding={{ top: 20, bottom: 20 }}
          width={36}
          tick={{ stroke: '#687182', strokeWidth: 0.4, fontSize: 14 }}
          tickFormatter={(value) => {
            return indicator?.unit === '%' ? `${(value * 100).toFixed(0)}%` : value
          }}
          axisLine={false}
        />
        <Tooltip
          wrapperStyle={{ outline: 'none' }}
          isAnimationActive={false}
          cursor={{ stroke: '#d1d5db', strokeWidth: 1 }}
          content={({ active, payload, label }) => {
            const selectedPayload = selectedLine
              ? payload?.filter((entry) => entry.dataKey === selectedLine)
              : payload
            const formattedPayload = selectedPayload?.map((entry) => ({
              ...entry,
              value: indicator
                ? indicator.unit === '%'
                  ? (Number(entry.value) * 100).toLocaleString('pt-BR', {
                      minimumFractionDigits: indicator.decimalPlaces,
                      maximumFractionDigits: indicator.decimalPlaces,
                    })
                  : Number(entry.value).toLocaleString('pt-BR', {
                      minimumFractionDigits: indicator.decimalPlaces,
                      maximumFractionDigits: indicator.decimalPlaces,
                    })
                : entry.value,
            }))
            return <ChartTooltip active={active} payload={formattedPayload} label={label} />
          }}
          position={{ y: 0 }}
        />
        <Legend
          iconType="square"
          align="left"
          content={
            <ChartLegend
              colorMap={colorMap}
              selectedLine={selectedLine}
              setSelectedLine={setSelectedLine}
              indicator={indicator}
            />
          }
        />
        {Object.entries(colorMap)
          .filter(([key]) => selectedLine !== key)
          .map(([key, color]) => (
            <Line
              key={key}
              dataKey={key}
              stroke={selectedLine ? (selectedLine === key ? color : '#D1D5DB') : color}
              strokeWidth={selectedLine ? (selectedLine === key ? 4 : 2) : 3}
              dot={{ fill: color, r: selectedLine ? (selectedLine === key ? 5 : 4) : 5 }}
              activeDot={{
                fill: color,
                stroke: color,
                r: selectedLine ? (selectedLine === key ? 8 : 2) : 6.5,
              }}
              id={`chart-data-line-${key}`}
              connectNulls
              onClick={() =>
                isStratified ? setSelectedLine(selectedLine === key ? null : key) : undefined
              }
            />
          ))}
        {isStratified &&
          selectedLine &&
          Object.entries(colorMap).find(([key]) => key === selectedLine) && (
            <Line
              key={selectedLine}
              dataKey={selectedLine}
              stroke={colorMap[selectedLine]!}
              strokeWidth={4}
              dot={{ fill: colorMap[selectedLine]!, r: 6 }}
              activeDot={{
                fill: colorMap[selectedLine]!,
                stroke: colorMap[selectedLine]!,
                r: 8,
              }}
              id={`chart-data-line-${selectedLine}`}
              connectNulls
              onClick={() => setSelectedLine(null)}
            />
          )}
      </BaseLineChart>
    </ResponsiveContainer>
  )
}

type ChartLegendProps = {
  colorMap: { [key: string]: string }
  selectedLine: string | null
  setSelectedLine: (value: string | null) => void
  indicator: IndicatorWithValues
}

function ChartLegend({ colorMap, selectedLine, setSelectedLine, indicator }: ChartLegendProps) {
  return (
    <ul
      className="mt-1.5 flex flex-col gap-4 text-xs font-medium text-[#687182] md:flex-row md:justify-between"
      id="chart-legend"
    >
      {Object.entries(colorMap).length > 1 && (
        <div className="flex gap-3 md:w-1/2">
          <span>Legenda:</span>
          <div className="flex flex-1 flex-wrap">
            {Object.entries(colorMap).map(([key, color], index) => (
              <li
                key={`item-${index}`}
                className="flex items-start gap-1 rounded-md px-2 py-1.5 hover:cursor-pointer hover:bg-gray-200"
                onClick={() => setSelectedLine(selectedLine === key ? null : key)}
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 10 10"
                  fill={color}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="10" height="10" />
                </svg>
                <span className="whitespace-nowrap">{key}</span>
              </li>
            ))}
          </div>
        </div>
      )}
      <div className="flex gap-1 md:ml-auto md:max-w-[300px] lg:max-w-[400px]">
        <span>Fonte:</span>
        <p>{indicator?.source}</p>
      </div>
    </ul>
  )
}
