import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function ChartLayout() {
  return (
    // <div className="flex w-full flex-1 flex-col space-y-4 rounded-md bg-white p-4">
    //   {/* Title & Subtitle */}
    //   <div className="flex flex-col">
    //     <span className="text-lg font-bold text-primary">
    //       Título do Gráfico
    //     </span>
    //     <span className="text-sm font-light text-primary">
    //       Subtítulo do Gráfico
    //     </span>
    //   </div>
    //   {/* Chart & Description */}
    //   <div className="flex flex-1 flex-col md:flex-row md:space-x-4">
    //     {/* Description */}
    //     <div className="order-last mt-3 flex h-20 w-full shrink-0 items-center justify-center bg-red-300 text-primary md:order-none md:mt-0 md:h-auto md:w-1/3 lg:w-1/4">
    //       Descrição do Gráfico
    //     </div>
    //     {/* Chart */}
    //     <div className="flex flex-1 items-center justify-center bg-green-300 text-primary">
    //       Gráfico
    //     </div>
    //   </div>
    // </div>
    <Card className="flex w-full flex-1 flex-col space-y-4 rounded-md bg-white">
      <CardHeader className="flex flex-col">
        <CardTitle className="text-lg font-bold text-primary">
          Título do Gráfico
        </CardTitle>
        <CardDescription className="text-sm font-light text-primary">
          Subtítulo do Gráfico
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col md:flex-row md:space-x-4">
        <div className="order-last mt-3 flex h-20 w-full shrink-0 items-center justify-center bg-red-300 text-primary md:order-none md:mt-0 md:h-auto md:w-1/3 lg:w-1/4">
          Descrição do Gráfico
        </div>
        <div className="flex flex-1 items-center justify-center bg-green-300 text-primary">
          Gráfico
        </div>
      </CardContent>
    </Card>
  )
}
