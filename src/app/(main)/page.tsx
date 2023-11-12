import { StatCard } from '@/components/dashboard/cards'
import { ChartLayout } from '@/components/dashboard/charts'

export default function Home() {
  return (
    <div className="flex w-full flex-1 flex-col sm:space-y-3">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          title="Estatística 1"
          information="+20,1% desde o último mês"
          value={1.2}
          important
        />
        <StatCard
          title="Estatística 2"
          information="+20,1% desde o último mês"
          value={3.4}
          important
        />
        <StatCard
          title="Estatística 3"
          information="+20,1% desde o último mês"
          value={5.6}
        />
        <StatCard
          title="Estatística 4"
          information="+20,1% desde o último mês"
          value={7.8}
        />
      </div>
      <ChartLayout />
    </div>
  )
}
