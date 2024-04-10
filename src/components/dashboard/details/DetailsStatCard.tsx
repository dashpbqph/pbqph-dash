import { ElementType } from 'react'
import { LucideIcon } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type DetailsStatListProps = {
  title: string
  value: string
  variation: string
  icon: LucideIcon
}

export default function DetailsStatCard({
  title,
  value,
  variation,
  icon,
}: DetailsStatListProps) {
  const Icon = icon as ElementType
  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon strokeWidth={2} className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{variation}</p>
      </CardContent>
    </Card>
  )
}
