import { LucideIcon } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Markdown from '@/app/_providers/markdown-provider'

type DetailsStatListProps = {
  title: string
  value: number
  unit: string
  decimalPlaces: number
  icon: LucideIcon
}

export default function DetailsStatCard({
  title,
  value,
  unit,
  decimalPlaces,
  icon: Icon,
}: DetailsStatListProps) {
  return (
    <Card className="flex h-fit flex-1 flex-col justify-center gap-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon strokeWidth={2} className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="py-2">
        <div className="text-3xl font-bold">
          {unit === '%'
            ? (Number(value) * 100).toLocaleString('pt-BR', {
                minimumFractionDigits: decimalPlaces,
                maximumFractionDigits: decimalPlaces,
              })
            : value.toLocaleString('pt-BR', {
                minimumFractionDigits: decimalPlaces,
                maximumFractionDigits: decimalPlaces,
              })}
          {!['absoluta', 'adimensional'].includes(unit) &&
            (unit === '%' ? (
              '%'
            ) : (
              <Markdown className="ml-2 inline-block text-sm text-black">{`$${unit}$`}</Markdown>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
