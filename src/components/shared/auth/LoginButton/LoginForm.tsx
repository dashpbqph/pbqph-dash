import Image from 'next/image'
import { loginSchema } from '@/server/validation/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Spinner from '@/components/ui/spinner'
import { toast } from '@/components/ui/use-toast'
import { useLogin } from '@/hooks/auth'

type LoginFormProps = {
  onClose: () => void
}

export default function LoginForm({ onClose }: LoginFormProps) {
  const { isLoading, login } = useLogin()

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmitLoginForm(values: z.infer<typeof loginSchema>) {
    const response = await login(values)
    if (response.ok) {
      onClose()
      toast({ title: 'Login com sucesso', status: 'success' })
    } else {
      toast({ title: response.error, status: 'error' })
    }
  }

  return (
    <Form {...loginForm}>
      <form
        className="space-y-7 rounded-xl"
        onSubmit={loginForm.handleSubmit(onSubmitLoginForm)}
      >
        <DialogHeader>
          <DialogTitle className="flex flex-col items-start space-y-5">
            <Image
              src="/logo-icon-only.svg"
              height="80"
              width="80"
              alt="Logo PBQP-H"
            />
            <div className="flex flex-col space-y-1">
              <span className="text-left text-xl font-bold">Entrar</span>
              <p className="text-left font-light">
                para continuar em Dashboard PBQP-H
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <FormField
            control={loginForm.control}
            name="username"
            render={({ field }) => (
              <FormItem className="grid w-full items-center gap-2.5">
                <FormLabel>Nome de Usuário</FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input autoFocus {...field} />
                  </FormControl>
                  <FormMessage className="font-light text-red-500" />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem className="grid w-full items-center gap-2.5">
                <FormLabel>Senha</FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage className="font-light text-red-500" />
                </div>
              </FormItem>
            )}
          />
        </div>
        <Button
          type={isLoading ? 'button' : 'submit'}
          className="flex w-full flex-row gap-2 bg-[#005192] data-[loading=true]:cursor-not-allowed"
          data-loading={isLoading}
          disabled={isLoading}
        >
          {isLoading && <Spinner />}
          {isLoading ? 'Processando...' : 'Entrar'}
        </Button>
      </form>
    </Form>
  )
}
