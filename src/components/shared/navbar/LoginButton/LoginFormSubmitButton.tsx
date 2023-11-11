import { Button } from '@/components/ui/button'
import Spinner from '@/components/ui/spinner'

type LoginFormSubmitButtonProps = {
  isLoading: boolean
}

export default function LoginFormSubmitButton({
  isLoading,
}: LoginFormSubmitButtonProps) {
  return isLoading ? (
    <Button className="flex w-full cursor-progress flex-row gap-2">
      <Spinner />
      Processando...
    </Button>
  ) : (
    <Button type="submit" className="w-full">
      Entrar
    </Button>
  )
}
