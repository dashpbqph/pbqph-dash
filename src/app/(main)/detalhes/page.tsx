'use client'

import { useSearchParams } from 'next/navigation'
import { api } from '@/trpc/react'

import { LineChart as DetailsLineChart } from '@/components/dashboard/charts'
import { DetailsInfo, DetailsStatList } from '@/components/dashboard/details'
import { Separator } from '@/components/ui/separator'

export default function Details() {
  const searchParams = useSearchParams()
  const indicatorId = searchParams.get('id') as string
  const [indicator] = api.indicator.getIndicatorById.useSuspenseQuery({
    id: indicatorId,
  })

  if (!indicator) return null
  return (
    <div className="flex w-full flex-1 flex-col gap-3 rounded-md bg-white p-6 text-black">
      <DetailsInfo indicator={indicator} />
      <Separator />
      <div className="flex flex-1 gap-4 xxs:flex-col sm:flex-row">
        <DetailsStatList indicator={indicator} />
        <div className="flex h-[500px] flex-1 flex-col items-end sm:h-auto">
          <DetailsLineChart indicator={indicator} />
        </div>
      </div>
    </div>
  )
}
