'use client'

import { useSearchParams } from 'next/navigation'
import { api } from '@/trpc/react'

export default function Details() {
  const searchParams = useSearchParams()

  const indicatorId = searchParams.get('i') as string
  const { data: indicator } = api.indicator.getIndicatorById.useQuery({
    id: indicatorId,
  })
  return (
    <div className="flex w-full flex-1 flex-col space-y-3 rounded-md bg-white p-6">
      <h1 className="text-2xl font-semibold text-black">
        {indicator?.name} ({indicator?.code})
      </h1>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col space-y-1">
          <span className="font-semibold">Polaridade:</span>
          <span>{indicator?.polarity}</span>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="font-semibold">Acumulativo:</span>
          <span>{indicator?.cumulative ? 'Sim' : 'Não'}</span>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="font-semibold">Fonte:</span>
          <span>{indicator?.source}</span>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="font-semibold">Periodicidade:</span>
          <span>{indicator?.periodicity}</span>
        </div>
      </div>
    </div>
  )
}
