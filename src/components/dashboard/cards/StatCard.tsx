import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type StatCardProps = {
  title: string
  information?: string
  value: number
  className?: string
}

export default function StatCard({
  className,
  title,
  information,
  value,
}: StatCardProps) {
  return (
    <Card className={cn('hidden md:block', className)}>
      <CardHeader className="space-y-0 pb-2">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">
          {value.toLocaleString('pt-BR')}
        </div>
        <p className="text-sm text-muted-foreground">{information}</p>
      </CardContent>
    </Card>
  )
}
