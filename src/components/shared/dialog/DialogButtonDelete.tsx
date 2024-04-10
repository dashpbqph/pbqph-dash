import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Spinner from '@/components/ui/spinner'

type DialogButtonDeleteProps = {
  isLoading: boolean
  deleteFn: () => void
}

export default function DialogButtonDelete({
  isLoading,
  deleteFn,
}: DialogButtonDeleteProps) {
  return (
    <Button
      className={cn(
        'bg-primary text-sm text-primary-foreground',
        isLoading && 'group flex cursor-progress flex-row gap-2',
      )}
      onClick={() => (!isLoading ? deleteFn() : undefined)}
      data-loading={isLoading}
    >
      <Spinner className="hidden group-data-[loading=true]:block" />
      {isLoading ? 'Removendo...' : 'Confirmar'}
    </Button>
  )
}
