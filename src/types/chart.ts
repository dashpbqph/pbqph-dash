export type ChartDataItem = {
  period: string
} & {
  [key: string]: number | string | null
}
