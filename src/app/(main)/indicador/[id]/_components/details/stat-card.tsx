import { LucideIcon } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type DetailsStatListProps = {
  title: string
  value: string
  icon: LucideIcon
}

export default function DetailsStatCard({ title, value, icon: Icon }: DetailsStatListProps) {
  return (
    <Card className="flex h-fit flex-1 flex-col justify-center gap-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon strokeWidth={2} className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="py-2">
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
