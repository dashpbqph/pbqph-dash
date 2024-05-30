'use client'

import { useMemo, useState } from 'react'
import { api } from '@/trpc/react'
import {
  Activity,
  CalendarClockIcon,
  CheckIcon,
  ChevronDown,
  DownloadIcon,
  MoreHorizontal,
  SearchIcon,
} from 'lucide-react'

import { ChartDataItem } from '@/types/chart'
import { IndicatorWithValues } from '@/types/indicator'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { LineChart as DetailsLineChart } from './_components/charts/line-chart'
import { getChartData } from './_components/charts/utils'
import { DetailsInfo } from './_components/details'
import DetailsStatCard from './_components/details/stat-card'
import DetailsTable from './_components/table'
import handleDownloadCSV from './helpers/export-data'

const STRATIFICATION_OPTIONS = [
  { value: 'region', label: 'Região' },
  { value: 'company', label: 'Construtora' },
  { value: 'project', label: 'Obra' },
  { value: 'oac', label: 'OAC' },
  { value: 'psq', label: 'PSQ' },
  { value: 'guideline', label: 'Diretriz' },
]

function getStratificationList(indicator: IndicatorWithValues) {
  const stratifications = new Set<string>()
  if (indicator?.stratifiedByRegion) stratifications.add('region')
  if (indicator?.stratifiedByCompany) stratifications.add('company')
  if (indicator?.stratifiedByProject) stratifications.add('project')
  if (indicator?.stratifiedByOAC) stratifications.add('oac')
  if (indicator?.stratifiedByPSQ) stratifications.add('psq')
  if (indicator?.stratifiedByGuideline) stratifications.add('guideline')

  return Array.from(stratifications)
}

const LAG_OPTIONS = [
  { value: '2', label: 'Últimos 2' },
  { value: '5', label: 'Últimos 5' },
  { value: '10', label: 'Últimos 10' },
  { value: '20', label: 'Últimos 20' },
  { value: 'all', label: 'Todos' },
]

type DetailsProps = {
  params: {
    id: string
  }
}

export default function Details({ params }: DetailsProps) {
  const [lag, setLag] = useState('5')
  const [stratifications, setStratifications] = useState<string[]>([])
  const [indicator] = api.indicator.getIndicatorById.useSuspenseQuery({
    id: params.id,
  })

  const chartData = useMemo(() => {
    if (!indicator) return [] as ChartDataItem[]
    return getChartData({ indicator, stratifications })
  }, [indicator, stratifications])

  const rawStratifications = useMemo(() => getStratificationList(indicator), [indicator])

  function handleStratificationChange(value: string) {
    // se selecionar projeto, seleciona também construtora
    // se deselecionar construtora, deseleciona também projeto
    const isSelecting = !stratifications.includes(value)
    if (isSelecting) {
      if (value !== 'project') {
        setStratifications([...stratifications, value])
      } else {
        setStratifications(
          !stratifications.includes('company')
            ? [...stratifications, 'company', 'project']
            : [...stratifications, 'project'],
        )
      }
    } else {
      if (value === 'company') {
        setStratifications(
          stratifications.filter((strat) => strat !== 'project' && strat !== 'company'),
        )
      } else {
        setStratifications(stratifications.filter((strat) => strat !== value))
      }
    }
  }

  const isTable = indicator?.code === 'ITC'

  if (!indicator) return null
  return (
    <div
      className={cn(
        'flex flex-1 flex-col gap-3 rounded-md bg-secondary p-4 text-black',
        isTable && 'max-h-[calc(100vh-108px)]',
      )}
    >
      <DetailsInfo indicator={indicator} />
      <div className="flex flex-1 gap-3 overflow-auto xxs:flex-col sm:flex-row">
        {isTable ? (
          <div className="scrollbar flex flex-1 overflow-auto rounded-md">
            <DetailsTable indicator={indicator} />
          </div>
        ) : (
          <div className="flex h-[500px] flex-1 flex-col items-end sm:h-auto">
            <DetailsLineChart
              indicator={indicator}
              chartData={chartData}
              lagLimit={lag === 'all' ? chartData.length : Number(lag)}
              className="overflow-hidden rounded-md bg-background p-2"
            />
          </div>
        )}
        <div className="flex flex-col gap-3">
          <div className="flex h-8 w-full gap-2">
            {!isTable && (
              <Popover>
                <PopoverTrigger className="h-8 px-1.5 shadow-md" asChild>
                  <Button variant="outline">
                    <MoreHorizontal className="h-5 w-5" strokeWidth={2.6} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="flex w-[210px] flex-col gap-3 p-3"
                  align="start"
                  sideOffset={6}
                >
                  <Select onValueChange={setLag} value={lag}>
                    <SelectTrigger className="flex h-10 justify-between px-4 text-xs font-medium text-secondary hover:bg-white">
                      <div className="flex items-center gap-2">
                        <CalendarClockIcon className="h-4 w-4" />
                        <SelectValue placeholder={lag === 'all' ? 'Todos' : `Últimos ${lag}`} />
                      </div>
                    </SelectTrigger>
                    <SelectContent side="left" align="start" sideOffset={10}>
                      {LAG_OPTIONS.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          disabled={
                            option.value !== 'all' && chartData.length < Number(option.value)
                          }
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button className="flex h-10 justify-between" variant="outline">
                        <div className="flex gap-2">
                          <SearchIcon className="h-4 w-4" />
                          <span className="text-xs font-medium">Estratificação</span>
                        </div>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      side="left"
                      align="start"
                      sideOffset={14}
                      className="flex w-36 flex-col gap-0.5 p-1"
                    >
                      {STRATIFICATION_OPTIONS.map((option) => (
                        <div
                          key={option.value}
                          className="relative flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 pl-8 hover:bg-accent data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
                          onClick={() =>
                            rawStratifications.includes(option.value)
                              ? handleStratificationChange(option.value)
                              : undefined
                          }
                          data-disabled={!rawStratifications.includes(option.value)}
                        >
                          {stratifications.includes(option.value) && (
                            <CheckIcon className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center" />
                          )}
                          <span className="text-sm">{option.label}</span>
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                </PopoverContent>
              </Popover>
            )}
            <Button
              className="flex h-8 w-full"
              // variant="primary"
              icon={DownloadIcon}
              onClick={() => handleDownloadCSV(indicator)}
            >
              Baixar dados
            </Button>
          </div>
          <div className="flex w-[228px] flex-1 flex-col gap-3">
            <DetailsStatCard title="Estatística 1" value="123,4" icon={Activity} />
            <DetailsStatCard title="Estatística 2" value="123,4" icon={Activity} />
            <DetailsStatCard title="Estatística 3" value="123,4" icon={Activity} />
          </div>
        </div>
      </div>
    </div>
  )
}
