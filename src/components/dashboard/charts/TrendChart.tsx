'use client'

import {
  LineChart as BaseLineChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

const pageData = [
  {
    date: '2018',
    NPNC: 200,
  },
  {
    date: '2019',
    NPNC: 200,
  },
  {
    date: '2020',
    NPNC: 155,
  },
  {
    date: '2021',
    NPNC: 120,
  },
  {
    date: '2022',
    NPNC: 90,
  },
  {
    date: '2023',
    NPNC: 120,
  },
]

export const TrendChart = () => {
  const min = pageData.reduce((acc, cur) => {
    if (cur.NPNC < acc.NPNC) return cur
    return acc
  })
  const max = pageData.reduce((acc, cur) => {
    if (cur.NPNC > acc.NPNC) return cur
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
        <XAxis dataKey="date" padding={{ left: 0, right: 20 }} hide />
        <YAxis padding={{ top: 20, bottom: 0 }} hide />
        <Line
          type="monotone"
          dataKey="NPNC"
          stroke="#6b7280"
          strokeWidth={2.5}
          dot={({ cx, cy, value }) => (
            <CustomDot
              key={cx}
              min={min}
              max={max}
              cx={cx}
              cy={cy}
              value={value}
            />
          )}
        />
      </BaseLineChart>
    </ResponsiveContainer>
  )
}

function CustomDot({
  cx,
  cy,
  value,
  min,
  max,
}: {
  cx: number
  cy: number
  value: number
  min: (typeof pageData)[number]
  max: (typeof pageData)[number]
}) {
  if (value === min.NPNC) {
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

  if (value === max.NPNC) {
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
