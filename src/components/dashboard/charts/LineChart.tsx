'use client'

import { RouterOutputs } from '@/trpc/shared'
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

import ChartTooltip from './ChartTooltip'

const pageData = [
  {
    date: '2018',
    'NPNC-Norte': 150,
    'NPNC-Nordeste': 48,
    'NPNC-Centro-Oeste': 180,
    'NPNC-Sul': -123,
    'NPNC-Sudeste': 90,
  },
  {
    date: '2019',
    'NPNC-Norte': 200,
    'NPNC-Nordeste': -78,
    'NPNC-Centro-Oeste': 140,
    'NPNC-Sul': -83,
    'NPNC-Sudeste': 70,
  },
  {
    date: '2020',
    'NPNC-Norte': 155,
    'NPNC-Nordeste': 108,
    'NPNC-Centro-Oeste': 120,
    'NPNC-Sul': -63,
    'NPNC-Sudeste': -40,
  },
  {
    date: '2021',
    'NPNC-Norte': 120,
    'NPNC-Nordeste': 118,
    'NPNC-Centro-Oeste': 160,
    'NPNC-Sul': -43,
    'NPNC-Sudeste': -100,
  },
  {
    date: '2022',
    'NPNC-Norte': 90,
    'NPNC-Nordeste': 168,
    'NPNC-Centro-Oeste': 190,
    'NPNC-Sul': -23,
    'NPNC-Sudeste': 10,
  },
  {
    date: '2023',
    'NPNC-Norte': 120,
    'NPNC-Nordeste': 198,
    'NPNC-Centro-Oeste': 140,
    'NPNC-Sul': -3,
    'NPNC-Sudeste': -10,
  },
]

const mapColors = {
  'NPNC-Norte': { color: '#0072B2' },
  'NPNC-Nordeste': { color: '#FFAE1B' },
  'NPNC-Centro-Oeste': { color: '#9C179E' },
  'NPNC-Sul': { color: '#009699' },
  'NPNC-Sudeste': { color: '#259F46' },
}

type Indicator = RouterOutputs['indicator']['getIndicatorById']

type LineChartProps = {
  indicator: Indicator
}

export const LineChart = ({ indicator }: LineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%" className="flex-1">
      <BaseLineChart width={500} height={300} data={pageData}>
        <CartesianGrid strokeDasharray="5 5" />
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
                        <span className="whitespace-nowrap">{entry.value}</span>
                      </li>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1 md:w-[300px] lg:w-[400px]">
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
