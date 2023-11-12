import { ChartCard, StatCard } from '@/components/dashboard/cards'

export default function Home() {
  return (
    <div className="flex w-full flex-1 flex-col sm:space-y-3">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          title="Estatística 1"
          value={1.2}
          information="+20,1% desde o último mês"
          important
        />
        <StatCard
          title="Estatística 2"
          value={3.4}
          information="+20,1% desde o último mês"
          important
        />
        <StatCard
          title="Estatística 3"
          value={5.6}
          information="+20,1% desde o último mês"
        />
        <StatCard
          title="Estatística 4"
          value={7.8}
          information="+20,1% desde o último mês"
        />
      </div>
      <ChartCard
        title="Título do gráfico"
        subtitle="Subtítulo do gráfico"
        description="Descrição do Gráfico"
      >
        Gráfico
      </ChartCard>
    </div>
  )
}
