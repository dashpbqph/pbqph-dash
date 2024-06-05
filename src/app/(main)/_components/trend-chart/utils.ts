import { ChartDataItem } from '@/types/chart'

export function calculateMean(values: (number | null)[]): number {
  const filteredValues = values.filter((value): value is number => value !== null)
  return filteredValues.length > 0
    ? filteredValues.reduce((sum, value) => sum + value, 0) / filteredValues.length
    : 0
}

export function reduceMeanFromChartData(data: ChartDataItem[]) {
  return data.map(({ period, ...rest }) => {
    const numericValues = Object.values(rest).filter(
      (value) => typeof value === 'number',
    ) as number[]
    const meanValue = calculateMean(numericValues)

    return {
      period,
      mean: meanValue,
    }
  })
}
