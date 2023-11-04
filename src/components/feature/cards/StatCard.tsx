import { cn } from '@/lib/utils'

type StatCardProps = {
  title: string
  value: number
  className?: string
  important?: boolean
}

export default function StatCard({
  className,
  title,
  value,
  important = false,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col p-2 text-center text-primary data-[important=false]:hidden data-[important=false]:sm:flex',
        className,
      )}
      data-important={important}
    >
      {/* Title */}
      <span className="text-lg font-medium">{title}</span>
      {/* Value */}
      <div className="flex flex-1 items-center justify-center text-7xl font-extrabold">
        {value.toLocaleString('pt-BR')}
      </div>
    </div>
  )
}
