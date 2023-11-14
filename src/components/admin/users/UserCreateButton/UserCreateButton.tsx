'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import UserCreateForm from './UserCreateForm'

export default function UserCreateButton({
  refetchUsers,
}: {
  refetchUsers: () => void
}) {
  const [open, setOpen] = useState(false)

  async function onClose() {
    setOpen(false)
    refetchUsers()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Criar usuário</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] p-7 md:max-w-[650px]">
        <DialogHeader className="text-left">
          <DialogTitle>Criar usuário</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para criar um novo usuário.
          </DialogDescription>
        </DialogHeader>
        <UserCreateForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  )
}
