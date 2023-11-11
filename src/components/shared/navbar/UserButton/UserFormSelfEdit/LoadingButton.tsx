import { Button } from '@/components/ui/button'
import Spinner from '@/components/ui/spinner'

type LoadingButtonProps = {
  text: string
  isLoading: boolean
}

export default function LoadingButton({ text, isLoading }: LoadingButtonProps) {
  return (
    <Button
      type={isLoading ? 'button' : 'submit'}
      className="flex w-full flex-row gap-2 data-[loading=true]:cursor-not-allowed"
      data-loading={isLoading}
      disabled={isLoading}
    >
      {isLoading && <Spinner />}
      {isLoading ? 'Processando...' : text}
    </Button>
  )
}
