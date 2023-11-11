import React from 'react'
import { useRouter } from 'next/navigation'
import { optionalPasswordSchema } from '@/server/validation/auth'
import { api } from '@/trpc/react'
import { api as server } from '@/trpc/server'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserCog } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { uploadFiles } from '@/utils/uploadthing'
import EditableAvatar from './EditableAvatar'
import LoadingButton from './LoadingButton'
import UserFormFields from './UserFormFields'
import UserInformation from './UserInformation'

type User = Awaited<ReturnType<typeof server.user.getUserByUsername.query>>

type UserFormSelfEditProps = {
  user: User
}

const userSelfEditFormSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
      .max(100, { message: 'O nome deve ter no máximo 100 caracteres.' })
      .regex(/^[a-zA-Z]+$/, {
        message: 'O nome só pode ter letras, sem espaços.',
      }),
    lastName: z
      .string()
      .max(100, { message: 'O sobrenome deve ter no máximo 100 caracteres.' })
      .regex(/^[a-zA-Z]*$/, {
        message: 'O sobrenome só pode ter letras, sem espaços.',
      })
      .optional(),
    email: z.string().email({ message: 'Email inválido.' }),
    password: optionalPasswordSchema,
    confirmPassword: z.string(),
    image: z.instanceof(File),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'As senhas não coincidem.',
        path: ['confirmPassword'],
      })
    }
  })

type UploadImageProps = {
  username: string
  imageFile: File
}
async function uploadImage({
  username,
  imageFile,
}: UploadImageProps): Promise<void> {
  if (imageFile.size === 0) return

  try {
    await uploadFiles({
      files: [imageFile],
      endpoint: 'imageUploader',
      input: { username },
    })
  } catch (error) {
    throw new Error('Erro ao enviar imagem')
  }
}

export default function UserFormSelfEdit({ user }: UserFormSelfEditProps) {
  const router = useRouter()
  const { username, firstName, lastName, email, avatar, role } = user

  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const { mutate: updateUserSelf } = api.user.updateSelf.useMutation({
    onSuccess: async () => {
      await uploadImage({
        username: user.username,
        imageFile: userSelfEditForm.getValues('image'),
      })
      router.refresh()
      setOpen(false)
    },
  })

  const userSelfEditForm = useForm<z.infer<typeof userSelfEditFormSchema>>({
    resolver: zodResolver(userSelfEditFormSchema),
    defaultValues: {
      firstName,
      lastName: lastName ?? undefined,
      password: '',
      confirmPassword: '',
      email,
      image: new File([], ''),
    },
  })

  const onSubmitSelfEditForm = async (
    values: z.infer<typeof userSelfEditFormSchema>,
  ) => {
    setIsLoading(true)

    try {
      updateUserSelf({
        username,
        firstName: values.firstName,
        lastName: values.lastName as string,
        email: values.email,
        password: values.password,
        image: '', // placeholder, will be updated in the onSuccess callback
      })

      toast({
        title: 'Informações atualizadas',
        description: (
          <div className="mt-1 rounded-md">
            <span>
              As informações da conta <strong>{username}</strong> foram
              atualizadas.
            </span>
          </div>
        ),
        status: 'success',
      })
    } catch (error) {
      toast({
        title: 'Erro ao atualizar informações',
        description: (
          <div className="mt-1 rounded-md">
            <span>
              Ocorreu um erro ao atualizar as informações da conta{' '}
              <strong>{username}</strong>.
            </span>
          </div>
        ),
        status: 'error',
      })
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="flex space-x-4 py-4 transition-all hover:pl-3"
          onSelect={(e) => e.preventDefault()}
        >
          <UserCog className="h-5 w-5" />
          <span>Editar Conta</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="max-w-[360px] p-7 md:max-w-[460px]">
        <DialogHeader className="text-left">
          <DialogTitle>Editar Conta</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para editar sua conta.
          </DialogDescription>
        </DialogHeader>
        <Form {...userSelfEditForm}>
          <form
            className="flex flex-col gap-3"
            onSubmit={userSelfEditForm.handleSubmit(onSubmitSelfEditForm)}
          >
            <EditableAvatar form={userSelfEditForm} userAvatar={avatar} />
            <UserInformation username={username} role={role} />
            <Separator />
            <UserFormFields form={userSelfEditForm} />
            <DialogFooter>
              <LoadingButton isLoading={isLoading} text="Salvar Alterações" />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
