'use client'

import { useState } from 'react'
import { api } from '@/trpc/react'

import { Combobox } from '@/components/ui/combobox'

export default function IndicatorFilters() {
  // states
  const [system, setSystem] = useState<string | null>(null)
  const [category, setCategory] = useState<string | null>(null)
  const [indicator, setIndicator] = useState<string | null>(null)

  // queries
  const { data: systems } = api.system.getAll.useQuery()
  const { data: categories } = api.category.getAllBySystem.useQuery(
    {
      systemCode: system ?? '',
    },
    {
      enabled: !!system,
    },
  )
  const { data: indicators } = api.indicator.getAllBySystemAndCategory.useQuery(
    {
      systemCode: system ?? '',
      categoryName: category ?? '',
    },
    {
      enabled: !!system && !!category,
    },
  )

  // content lists
  const systemContentList = (systems ?? []).map((system) => ({
    value: system.code,
    label: system.name,
  }))
  const categoryContentList = (categories ?? []).map((category) => ({
    value: category.name,
    label: category.name,
  }))
  const indicatorContentList = (indicators ?? []).map((indicator) => ({
    value: indicator.name,
    label: indicator.name,
  }))

  return (
    <div className="col-span-10 row-span-1 flex flex-col gap-3 md:col-span-7 md:flex-row lg:col-span-8">
      <Combobox
        className="h-8 w-full"
        contentList={systemContentList}
        placeholderValue="Todos os Sistemas"
        placeholderSearch="Buscar sistema..."
        placeholderEmpty="Nenhum sistema encontrado"
        onChange={(value) => setSystem(value)}
      />
      <Combobox
        className="h-8 w-full"
        contentList={categoryContentList}
        placeholderValue="Todas as Categorias"
        placeholderSearch="Buscar categoria..."
        placeholderEmpty={
          <div className="flex flex-col">
            <span className="font-semibold">Nenhuma categoria encontrada.</span>
            <span>Certifique-se de ter selecionado um sistema.</span>
          </div>
        }
        onChange={(value) => setCategory(value)}
      />
      <Combobox
        className="h-8 w-full"
        contentList={indicatorContentList}
        placeholderValue="Todos os Indicadores"
        placeholderSearch="Buscar indicador..."
        placeholderEmpty={
          <div className="flex flex-col">
            <span className="font-semibold">Nenhum indicador encontrado.</span>
            <span>
              Certifique-se de ter selecionado um sistema e uma categoria.
            </span>
          </div>
        }
        onChange={(value) => setIndicator(value)}
      />
    </div>
  )
}
