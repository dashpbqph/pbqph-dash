'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { loginSchema } from '@/server/validation/auth'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Form } from '@/components/ui/form'
import { toast } from '@/components/ui/use-toast'
import { useLogin } from '@/hooks/auth'
import LoginFormFields from './LoginFormFields'

export default function LoginButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const { isLoading, login, errorMessage } = useLogin()

  async function onSubmitLoginForm(values: z.infer<typeof loginSchema>) {
    const response = await login(values)

    if (response) {
      setOpen(false)
      toast({ title: 'Login com sucesso', status: 'success' })
      router.refresh()
    } else {
      toast({ title: errorMessage, status: 'error' })
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
                  alt="Logo PBQP-H"
                />
                <div className="flex flex-col space-y-1">
                  <h2 className="text-left text-xl font-bold">Entrar</h2>
                  <p className="text-left font-light">
                    para continuar em Dashboard PBQP-H
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>
            <LoginFormFields loginForm={loginForm} isLoading={isLoading} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
