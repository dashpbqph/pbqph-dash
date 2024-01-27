import { useState } from 'react'
import { api } from '@/trpc/react'
import { ClipboardCopy, RefreshCw } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import Spinner from '@/components/ui/spinner'
import { toast } from '@/components/ui/use-toast'
import { generatePassword } from '@/utils/auth'
import type { User } from '@/types/user'

type UserResetPasswordDialogProps = {
  user: User
}

export default function UserResetPasswordDialog({
  user,
}: UserResetPasswordDialogProps) {
  const [password, setPassword] = useState('')
  const [open, setOpen] = useState(false)
  const { mutateAsync: setNewPassword, isLoading } =
    api.user.updatePassword.useMutation({
      onSuccess: () => {
        setOpen(false)
      },
    })

  async function handleCopyPassword() {
    if (password === '') return
    navigator.clipboard.writeText(password)

    toast({
      title: 'Senha copiada',
      description: 'A senha foi copiada para a área de transferência.',
      status: 'info',
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>Redefinir senha</AlertDialogTrigger>
      <AlertDialogContent className="space-y-2 bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Deseja realmente redefinir a senha do usuário {user.username}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xl-1">
            Esta ação não pode ser desfeita. Isso vai redefinir a senha do
            usuário para uma senha forte aleatória.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-2">
          <Button
            type="button"
            className="flex-1 justify-start text-sm disabled:bg-gray-100 disabled:opacity-100"
            variant="outline"
            onClick={() => setPassword(generatePassword())}
            disabled={password !== ''}
          >
            {password === ''
              ? 'Clique para gerar uma nova senha forte'
              : password}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="p-2"
            onClick={() => setPassword(generatePassword())}
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="p-2"
            onClick={handleCopyPassword}
          >
            <ClipboardCopy className="h-5 w-5" />
          </Button>
        </div>
        <AlertDialogFooter className="mt-0">
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          {isLoading ? (
            <Button className="flex cursor-progress flex-row gap-2 bg-primary text-sm text-primary-foreground">
              <Spinner />
              Redefinindo...
            </Button>
          ) : (
            <Button
              className="bg-primary text-sm text-primary-foreground"
              onClick={() =>
                password !== '' &&
                setNewPassword({ username: user.username, password })
              }
            >
              Confirmar
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
