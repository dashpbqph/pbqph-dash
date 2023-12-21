'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import LoginForm from './LoginForm'

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
        <Button variant="ghost" className="text-md w-fit ring-1 ring-white">
          Entrar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md p-8">
        <LoginForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  )
}
