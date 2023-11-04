'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { loginSchema } from '@/server/validation/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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

export default function LoginButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmitLoginForm(values: z.infer<typeof loginSchema>) {
    try {
      setIsLoading(true)
      const resposeData = await signIn('credentials', {
        username: values.username,
        password: values.password,
        redirect: false,
      }).finally(() => setIsLoading(false))

      if (!resposeData) return

      if (resposeData.error === 'Invalid Credentials') {
        loginForm.setError('root', {
          message: 'Usuário ou senha incorreto',
        })
      } else if (resposeData.error) {
        loginForm.setError('root', {
          message: 'Erro ao fazer login, tente novamente mais tarde',
        })
      } else {
        setOpen(false)
        toast({
          title: 'Login com sucesso',
          status: 'success',
        })
        router.refresh()
      }
    } catch (error) {
      loginForm.setError('root', {
        message: 'Erro ao fazer login, tente novamente mais tarde',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-md w-full ring-1 ring-white">
          Entrar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md p-8">
        <Form {...loginForm}>
          <form
            className="space-y-5 rounded-xl"
            onSubmit={loginForm.handleSubmit(onSubmitLoginForm)}
          >
            <DialogHeader>
              <DialogTitle className="flex flex-col items-start space-y-5">
                <Image
                  src="/logo-icon-only.svg"
                  height="80"
                  width="80"
                  alt=""
                />
                <div className="flex flex-col space-y-1">
                  <h2 className="text-left text-xl font-bold">Entrar</h2>
                  <p className="text-left font-light">
                    para continuar em Dashboard PBQP-H
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>
            {loginForm.formState.errors.root && (
              <div className="flex flex-col rounded-md bg-red-100 p-2 px-3 text-red-500">
                <span className="font-medium">Erro ao fazer login:</span>
                <span className="font-light">
                  {loginForm.formState.errors.root.message}
                </span>
              </div>
            )}
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
            <div className="items-start">
              {isLoading ? (
                <Button className="flex w-full cursor-progress flex-row gap-2">
                  <Spinner />
                  Processando...
                </Button>
              ) : (
                <Button type="submit" className="w-full">
                  Entrar
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
