import { cn } from '@/lib/utils'

type SkeletonTableProps = {
  hasCreateButton?: boolean
}

export default function SkeletonTable({
  hasCreateButton = false,
}: SkeletonTableProps) {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div
        className={cn(
          'flex h-8 w-full',
          hasCreateButton ? 'justify-between gap-2' : 'justify-start',
        )}
      >
        <div className="h-8 w-[600px] animate-pulse rounded-md bg-gray-200" />
        {hasCreateButton && (
          <div className="w-[140px] animate-pulse rounded-md bg-gray-200" />
        )}
      </div>
      <div className="w-full flex-1 animate-pulse rounded-md bg-gray-200" />
      <div className="flex h-8 w-full justify-between gap-2">
        <div className="w-[140px] animate-pulse rounded-md bg-gray-200" />
        <div className="w-[240px] animate-pulse rounded-md bg-gray-200" />
      </div>
    </div>
  )
}
