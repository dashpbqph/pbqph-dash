import { IndicatorWithValues } from '@/types/indicator'
import { formatDateByPeriodicity } from '@/utils/indicator'

type CSVObjectValue = {
  date: string
  regiao?: string
  construtora?: string
  obra?: string
  oac?: string
  value?: number
}

function formatObjectValues(data: IndicatorWithValues) {
  if (!data) return []
  return data.values.map((item) => {
    let newItem: CSVObjectValue = {
      date: formatDateByPeriodicity(item.createdAt, data.periodicity),
    }

    // check for stratications
    if (data.stratifiedByRegion) newItem = { ...newItem, regiao: item.region as string }
    if (data.stratifiedByCompany) newItem = { ...newItem, construtora: item.company?.name }
    if (data.stratifiedByProject) newItem = { ...newItem, obra: item.project?.name }
    if (data.stratifiedByOAC) newItem = { ...newItem, oac: item.oac?.name }

    newItem = { ...newItem, value: item.value }

    return newItem
  })
}

function objectToCSV<T extends object>(data: T[]) {
  if (!data[0]) return ''

  const headers = Object.keys(data[0])
  const csv = [headers.join(',')]

  data.forEach((row) => {
    const values = headers.map((header) => row[header as keyof T])
    csv.push(values.join(','))
  })

  return csv.join('\n')
}

export function handleDownloadCSV(data: IndicatorWithValues) {
  const formattedData = formatObjectValues(data)
  const csv = objectToCSV(formattedData)
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const datetime = new Date()
  const datetimeString =
    datetime.toLocaleDateString('pt-BR') + '_' + datetime.toLocaleTimeString('pt-BR')
  a.download = `${data?.id}_${datetimeString}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}
