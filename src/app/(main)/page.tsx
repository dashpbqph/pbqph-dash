import { ChartCard, StatCard } from '@/components/dashboard/cards'
import { LineChart } from '@/components/dashboard/charts'

export default function Home() {
  return (
    <div className="flex w-full flex-1 flex-col md:space-y-3">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          title="Estatística 1"
          value={1.2}
          information="+20,1% desde o último mês"
        />
        <StatCard
          title="Estatística 2"
          value={3.4}
          information="+20,1% desde o último mês"
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
        title="NPNC(R,A)- Inclusão anual de novas empresas construtoras certificadas pelo SiAC - Execução de
        Obras por região do País"
        subtitle="Objetiva acompanhar, a cada ano, a tendência de variação da quantidade de novas empresas
        construtoras certificadas no SiAC – Execução de Obras, por região do País."
        description="Descrição do Gráfico"
      >
        <LineChart />
      </ChartCard>
    </div>
  )
}
