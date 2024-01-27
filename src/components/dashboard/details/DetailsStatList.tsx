import { RouterOutputs } from '@/trpc/shared'
import { Activity } from 'lucide-react'

import DetailsStatCard from './DetailsStatCard'

type Indicator = RouterOutputs['indicator']['getIndicatorById']

type DetailsStatListProps = {
  indicator: Indicator
}

export default function DetailsStatList({ indicator }: DetailsStatListProps) {
  return (
    <div className="hidden w-full flex-col gap-4 xxs:grid xxs:grid-cols-2 sm:w-44 sm:grid-cols-1 sm:grid-rows-4 md:w-[260px]">
      <DetailsStatCard
        title="Estatística 1"
        value="123,4"
        variation="+20,1% em relação à medição anterior"
        icon={Activity}
      />
      <DetailsStatCard
        title="Estatística 2"
        value="123,4"
        variation="+20,1% em relação à medição anterior"
        icon={Activity}
      />
      <DetailsStatCard
        title="Estatística 3"
        value="123,4"
        variation="+20,1% em relação à medição anterior"
        icon={Activity}
      />
      <DetailsStatCard
        title="Estatística 4"
        value="123,4"
        variation="+20,1% em relação à medição anterior"
        icon={Activity}
      />
    </div>
  )
}
