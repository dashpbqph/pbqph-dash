import { Combobox } from '@/components/ui/combobox'

const contentList = [
  {
    value: 'siac',
    label: 'SIAC',
  },
  {
    value: 'simat',
    label: 'SiMaC',
  },
  {
    value: 'sinat',
    label: 'SiNAT',
  },
]

export default function IndicatorFilters() {
  return (
    <div className="col-span-10 row-span-1 flex flex-col gap-3 md:col-span-7 md:flex-row lg:col-span-8">
      <Combobox
        className="h-8 w-full"
        contentList={contentList}
        placeholderValue="Todos os Sistemas"
        placeholderSearch="Buscar sistema..."
      />
      <Combobox
        className="h-8 w-full"
        contentList={contentList}
        placeholderValue="Todas as Categorias"
        placeholderSearch="Buscar categoria..."
      />
      <Combobox
        className="h-8 w-full"
        contentList={contentList}
        placeholderValue="Todos os Indicadores"
        placeholderSearch="Buscar indicador..."
      />
    </div>
  )
}
