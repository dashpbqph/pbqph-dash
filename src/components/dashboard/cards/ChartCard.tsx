import { ReactNode } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type ChartCardProps = {
  title: string
  subtitle: string
  children: ReactNode
  description: string
}

export default function ChartCard({
  title,
  subtitle,
  description,
  children,
}: ChartCardProps) {
  return (
    <Card className="flex w-full flex-1 flex-col space-y-4 rounded-md bg-white">
      <CardHeader className="flex flex-col">
        <CardTitle className="text-lg font-bold text-primary">
          {title}
        </CardTitle>
        <CardDescription className="text-sm font-light text-primary">
          {subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col md:flex-row md:space-x-4">
        <div className="order-last mt-3 hidden h-20 w-full shrink-0 items-center justify-center bg-red-300 text-primary md:order-none md:mt-0 md:h-auto md:w-1/3 lg:w-1/4">
          {description}
        </div>
        <div className="flex min-h-[400px] w-full flex-1 flex-col items-center justify-center text-primary">
          {children}
        </div>
      </CardContent>
    </Card>
  )
}
