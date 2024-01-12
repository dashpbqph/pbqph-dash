import { PieChart } from 'lucide-react'

import { IndicatorsTable } from '@/components/admin/indicators'

export default function AdminIndicator() {
  return (
    <>
      <div className="item flex items-center gap-4">
        <PieChart className="h-6 w-6" />
        <span className="text-2xl font-semibold">
          Administração de Indicadores
        </span>
      </div>
      <IndicatorsTable />
    </>
  )
}
