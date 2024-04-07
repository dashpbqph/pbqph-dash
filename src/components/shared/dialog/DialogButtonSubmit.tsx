import { Button } from '@/components/ui/button'
import Spinner from '@/components/ui/spinner'

type DialogButtonSubmitProps = {
  isLoading: boolean
  isUpdating: boolean
  subject: string
}

export default function DialogButtonSubmit({
  isLoading,
  isUpdating,
  subject,
}: DialogButtonSubmitProps) {
  return (
    <Button
      type={isLoading ? 'button' : 'submit'}
      className="flex w-full flex-row gap-2 data-[loading=true]:cursor-not-allowed"
      data-loading={isLoading}
      disabled={isLoading}
    >
      {isLoading && <Spinner />}
      {isLoading
        ? 'Processando...'
        : `${isUpdating ? 'Editar' : 'Criar'} ${subject}`}
    </Button>
  )
}
