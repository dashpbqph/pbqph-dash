/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from 'react'

import { Separator } from '@/components/ui/separator'

export const ChartTooltipFrame = ({ children }: { children: ReactNode }) => (
  <div className="rounded-md border bg-white shadow-lg">{children}</div>
)

export interface ChartTooltipRowProps {
  value: string
  name: string
  color: string
}

export const ChartTooltipRow = ({
  value,
  name,
  color,
}: ChartTooltipRowProps) => (
  <div className="flex items-center justify-between space-x-8">
    <div className="flex items-center space-x-2">
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      <p className="whitespace-nowrap text-right text-[#687182]">{name}</p>
    </div>
    <p className="whitespace-nowrap text-right font-medium tabular-nums">
      {value}
    </p>
  </div>
)

export interface ChartTooltipProps {
  active: boolean | undefined
  payload: any
  label: string
}

const ChartTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (active && payload) {
    const filteredPayload = payload.filter((item: any) => item.type !== 'none')
    return (
      <ChartTooltipFrame>
        <div className="px-4 py-2">
          <p className="font-medium">{label}</p>
        </div>
        <Separator />
        <div className="space-y-1 px-4 py-2">
          {filteredPayload.map(
            (
              {
                value,
                name,
                color,
              }: { value: number; name: string; color: string },
              idx: number,
            ) => (
              <ChartTooltipRow
                key={`id-${idx}`}
                value={String(value)}
                name={name}
                color={color}
              />
            ),
          )}
        </div>
      </ChartTooltipFrame>
    )
  }
  return null
}

export default ChartTooltip
