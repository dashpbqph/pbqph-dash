'use client'

import { useState } from 'react'
import Image from 'next/image'
import { passwordSchema, usernameSchema } from '@/server/validation/auth'
import { api } from '@/trpc/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserRole } from '@prisma/client'
import { Camera, ClipboardCopy, RefreshCw } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Spinner from '@/components/ui/spinner'
import { toast } from '@/components/ui/use-toast'
import { generatePassword, mapUserRoleToLabel } from '@/utils/auth'
import { uploadFiles } from '@/utils/uploadthing'

const userCreateFormSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
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
    }),
  email: z.string().email({ message: 'Email inválido.' }),
  image: z.instanceof(File),
  role: z.nativeEnum(UserRole),
})

export default function UserCreateForm({
  refetchUsers,
}: {
  refetchUsers: () => void
}) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { mutate: createUser } = api.user.create.useMutation({
    onSuccess: () => {
      refetchUsers()
      setOpen(false)
    },
  })

  const userCreateForm = useForm<z.infer<typeof userCreateFormSchema>>({
    resolver: zodResolver(userCreateFormSchema),
    defaultValues: {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      image: new File([], ''),
      role: UserRole.MEMBER,
    },
  })

  async function addImage() {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = 'image/jpeg, image/png'

    fileInput.addEventListener('change', async (e) => {
      const imageFile = (e.target as HTMLInputElement).files?.[0]
      if (imageFile) {
        if (imageFile.size > 4 * 1024 * 1024) {
          toast({
            title: 'Imagem muito grande',
            description: 'A imagem deve ter no máximo 4MB.',
            status: 'error',
          })
          return
        }

        userCreateForm.setValue('image', imageFile)
      }
    })

    fileInput.click()
  }

  async function handleGeneratePassword({ renew = false }) {
    if (renew || userCreateForm.getValues('password') === '') {
      userCreateForm.setValue('password', generatePassword())
    }
  }

  async function handleCopyPassword() {
    if (userCreateForm.getValues('password') === '') return
    navigator.clipboard.writeText(userCreateForm.getValues('password'))

    toast({
      title: 'Senha copiada',
      description: 'A senha foi copiada para a área de transferência.',
      status: 'info',
    })
  }

  async function onSubmitUserCreateForm(
    values: z.infer<typeof userCreateFormSchema>,
  ) {
    setIsLoading(true)
    try {
      // upload image to uploadthing
      const [image] = await uploadFiles({
        files: [values.image],
        endpoint: 'imageUploader',
      })
      if (!image) throw new Error('Erro ao enviar imagem')

      // create user on db
      createUser({
        ...values,
        image: image.url,
      })

      toast({
        title: 'Usuário criado com sucesso',
        description: (
          <div className="mt-1 rounded-md">
            <span>
              O usuário <strong>{values.username}</strong> foi criado com
              sucesso.
            </span>
          </div>
        ),
        status: 'success',
      })
    } catch (error) {
      toast({
        title: 'Erro ao criar usuário',
        description: (
          <div className="mt-1 rounded-md">
            <span>
              Ocorreu um erro ao criar o usuário{' '}
              <strong>{values.username}</strong>.
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
        <Button variant="outline">Criar usuário</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] p-7 md:max-w-[650px]">
        <DialogHeader className="text-left">
          <DialogTitle>Criar usuário</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para criar um novo usuário.
          </DialogDescription>
        </DialogHeader>
        <Form {...userCreateForm}>
          <form
            className="flex flex-col gap-3"
            onSubmit={userCreateForm.handleSubmit(onSubmitUserCreateForm)}
          >
            <div className="flex gap-3">
              <button
                type="button"
                className="group relative flex h-[85px] w-[85px] items-center justify-center overflow-hidden rounded-full bg-gray-400"
                onClick={addImage}
              >
                {userCreateForm.watch('image').size > 0 && (
                  <Image
                    src={URL.createObjectURL(userCreateForm.watch('image'))}
                    alt="imagem do usuário"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                )}
                <Camera className="relative z-10 hidden h-7 w-7 text-white transition-all group-hover:block" />
                <div className="absolute inset-0 bg-black bg-opacity-0 transition-all group-hover:bg-opacity-50" />
              </button>
              <div className="flex w-full flex-1 flex-col gap-3">
                <FormField
                  control={userCreateForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="w-full space-y-0.5">
                      <FormControl>
                        <Input
                          placeholder="Nome de usuário*"
                          autoFocus
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="font-light text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={userCreateForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="grid w-full items-center gap-2.5">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Função*" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(UserRole)
                            .reverse()
                            .map((role) => (
                              <SelectItem key={role} value={role}>
                                {mapUserRoleToLabel(role)}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="font-light text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <FormField
                control={userCreateForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="w-full space-y-0.5">
                    <FormControl>
                      <Input placeholder="Primeiro nome*" {...field} />
                    </FormControl>
                    <FormMessage className="font-light text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={userCreateForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="w-full space-y-0.5">
                    <FormControl>
                      <Input placeholder="Último nome" {...field} />
                    </FormControl>
                    <FormMessage className="font-light text-red-500" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={userCreateForm.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full space-y-0.5">
                  <FormControl>
                    <Input placeholder="Email*" {...field} />
                  </FormControl>
                  <FormMessage className="font-light text-red-500" />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button
                type="button"
                className="flex-1 justify-start text-sm disabled:bg-gray-100 disabled:opacity-100"
                variant="outline"
                onClick={() => handleGeneratePassword({ renew: false })}
                disabled={userCreateForm.watch('password') !== ''}
              >
                {userCreateForm.watch('password') === ''
                  ? 'Clique para gerar uma senha forte'
                  : userCreateForm.getValues('password')}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="p-2"
                onClick={() => handleGeneratePassword({ renew: true })}
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
            <DialogFooter>
              {isLoading ? (
                <Button className="flex w-full cursor-progress flex-row gap-2">
                  <Spinner />
                  Processando...
                </Button>
              ) : (
                <Button type="submit" className="w-full">
                  Criar usuário
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
