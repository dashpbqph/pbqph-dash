import { Periodicity } from '@prisma/client'

import { ChartDataItem } from '@/types/chart'
import { IndicatorWithValues } from '@/types/indicator'
import { formatDateByPeriodicity } from '@/utils/indicator'
import { capitalizeWords } from '@/utils/misc'

type StratificationProps = {
  region?: string
  company?: string
  project?: string
  oac?: string
  psq?: string
  guideline?: string
}

function getStratificationString(
  stratifications: string[],
  stratificationProps: StratificationProps,
): string {
  const stratificationLabels = stratifications.map((stratification) => {
    switch (stratification) {
      case 'region':
        return capitalizeWords(stratificationProps.region || '')
      case 'company':
        return stratificationProps.company || ''
      case 'project':
        return stratificationProps.project || ''
      case 'oac':
        return stratificationProps.oac || ''
      case 'psq':
        return stratificationProps.psq || ''
      case 'guideline':
        return stratificationProps.guideline || ''
      default:
        return ''
    }
  })

  return stratificationLabels.join(' - ') || 'Indicador'
}

function sortChartDataByPeriod(chartData: ChartDataItem[]): ChartDataItem[] {
  return chartData.sort((a, b) => {
    const yearA = parseInt(a.period.substring(0, 4))
    const yearB = parseInt(b.period.substring(0, 4))
    const periodNumberA = parseInt(a.period.substring(5, a.period.length))
    const periodNumberB = parseInt(b.period.substring(5, b.period.length))

    if (yearA !== yearB) {
      return yearA - yearB
    } else {
      return periodNumberA - periodNumberB
    }
  })
}

type GetChartDataProps = {
  indicator: IndicatorWithValues
  stratifications: string[]
}

export function getChartData({ indicator, stratifications }: GetChartDataProps): ChartDataItem[] {
  if (!indicator) return []

  let periodicity = indicator.periodicity
  const chartData: Record<string, Record<string, number[]>> = {}

  if (periodicity === Periodicity.EVENTUAL) {
    if (indicator.stratifiedByProject) {
      // if the indicator is stratified by project, it also is stratified by company
      // in this case, we cannot group the values by event,
      // so we use the annual periodicity to group the values by year
      periodicity = Periodicity.ANUAL
    } else {
      // eventual period cannot be grouped, because it has no defined periodicity
      // so we just sort the values by date and return them
      return indicator.values
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .map((value) => {
          const period = value.createdAt.toLocaleDateString('pt-BR')
          const label = getStratificationString(stratifications, {
            region: value.region as string,
            company: value.company?.name,
            project: value.project?.name,
            oac: value.oac?.name,
            psq: value.psq?.name,
            guideline: value.guideline?.name,
          })
          const key = `${label}`

          if (!chartData[period]) {
            chartData[period] = {}
          }

          if (!chartData[period]![key]) {
            chartData[period]![key] = []
          }

          chartData[period]![key]?.push(value.value)

          return { period, [key]: value.value }
        })
    }
  }

  // Group values by label and period
  indicator.values.forEach((value) => {
    const label = getStratificationString(stratifications, {
      region: value.region as string,
      company: value.company?.name,
      project: value.project?.name,
      oac: value.oac?.name,
      psq: value.psq?.name,
      guideline: value.guideline?.name,
    })
    const period = formatDateByPeriodicity(value.createdAt, periodicity)
    const key = `${label}`

    if (!chartData[period]) {
      chartData[period] = {}
    }

    if (!chartData[period]![key]) {
      chartData[period]![key] = []
    }

    chartData[period]![key]?.push(value.value)
  })

  const pageData = Object.entries(chartData).map(([period, values]) => {
    const averagedValues: Record<string, number> = {}

    Object.entries(values).forEach(([label, valueArray]) => {
      const sum = valueArray.reduce((acc, curr) => acc + curr, 0)
      const average = sum / valueArray.length
      averagedValues[label] = average
    })

    return { period, ...averagedValues }
  })

  return sortChartDataByPeriod(pageData)
}
