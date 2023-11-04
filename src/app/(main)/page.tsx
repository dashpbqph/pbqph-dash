import { StatCard } from '@/components/feature/cards'
import { ChartLayout } from '@/components/feature/chart'

export default function Home() {
  return (
    <div className="flex w-full flex-1 flex-col space-y-3">
      <div className="flex h-44 w-full space-x-3">
        <StatCard
          className="w-1/2 rounded-md bg-white sm:w-1/4"
          title="Estatística 1"
          value={1.2}
          important
        />
        <StatCard
          className="w-1/2 rounded-md bg-white sm:w-1/4"
          title="Estatística 2"
          value={3.4}
          important
        />
        <StatCard
          className="w-1/2 rounded-md bg-white sm:w-1/4"
          title="Estatística 3"
          value={5.6}
        />
        <StatCard
          className="w-1/2 rounded-md bg-white sm:w-1/4"
          title="Estatística 4"
          value={7.8}
        />
      </div>
      <ChartLayout />
    </div>
  )
}
