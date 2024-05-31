import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Spinner from '@/components/ui/spinner'

type DialogDeleteButtonProps = {
  isLoading: boolean
  deleteFn: () => void
}

export default function DialogDeleteButton({ isLoading, deleteFn }: DialogDeleteButtonProps) {
  return (
    <Button
      variant="destructive"
      className={cn('text-sm', isLoading && 'group flex cursor-progress flex-row gap-2')}
      onClick={() => (!isLoading ? deleteFn() : undefined)}
      data-loading={isLoading}
    >
      <Spinner className="hidden group-data-[loading=true]:block" />
      {isLoading ? 'Removendo...' : 'Confirmar'}
    </Button>
  )
}
