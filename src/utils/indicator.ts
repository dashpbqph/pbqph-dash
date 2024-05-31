import { Periodicity } from '@prisma/client'

export function formatDateByPeriodicity(date: Date, periodicity: Periodicity) {
  const month = date.getMonth()
  const year = date.getFullYear()
  if (periodicity === Periodicity.TRIMESTRAL) {
    const quarter = Math.floor(month / 3) + 1
    return `${year}.T${quarter}`
  } else if (periodicity === Periodicity.SEMESTRAL) {
    const semester = Math.floor(month / 6) + 1
    return `${year}.S${semester}`
  } else if (periodicity === Periodicity.ANUAL) {
    return date.toLocaleDateString('pt-BR', { year: 'numeric' })
  }

  // periodicity === 'eventual'
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function ema(values: number[], period: number = 3) {
  if (values.length === 0) {
    return null
  } else if (values.length === 1) {
    return values[0]
  } else if (values.length < period) {
    period = values.length
  }

  const multiplier = 2 / (period + 1)
  let ema = values.slice(0, period).reduce((acc, val) => acc + val, 0) / period

  for (let i = period; i < values.length; i++) {
    ema = (values[i]! - ema) * multiplier + ema
  }

  return ema
}
