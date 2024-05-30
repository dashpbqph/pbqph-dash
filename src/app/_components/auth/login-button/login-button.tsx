'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

import LoginForm from './login-form'

export default function LoginButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function onClose() {
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-8 w-fit overflow-hidden rounded-sm bg-white p-0 text-sm">
          <div className="h-full w-[9px] bg-accent" />
          <span className="flex h-full items-center bg-primary px-3">Entrar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md p-8">
        <LoginForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  )
}
