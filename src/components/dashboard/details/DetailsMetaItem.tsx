import { ReactNode } from 'react'

import { Separator } from '@/components/ui/separator'

export default function DetailsMetaItem({
  label,
  value,
}: {
  label: string
  value: ReactNode
}) {
  return (
    <div className="flex gap-5">
      <div className="flex items-center gap-2">
        <span className="font-medium">{label}:</span>
        {value}
      </div>
      <Separator orientation="vertical" className="hidden h-8 sm:block" />
    </div>
  )
}
