'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { optionalPasswordSchema } from '@/server/validation/auth'
import { api } from '@/trpc/react'
import { RouterOutputs } from '@/trpc/shared'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import Spinner from '@/components/ui/spinner'
import { toast } from '@/components/ui/use-toast'
import { mapUserRoleToLabel } from '@/utils/auth'
import { uploadFiles } from '@/utils/uploadthing'
import EditableAvatar from './EditableAvatar'

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

type UserSelfEditProps = {
  user: Awaited<RouterOutputs['user']['getUserByUsername']>
  onSubmit: () => void
}

export default function UserSelfEditForm({
  user,
  onSubmit,
}: UserSelfEditProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { username, firstName, lastName, email, avatar, role } = user

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

  const { mutateAsync: updateUserSelf } = api.user.updateSelf.useMutation({
    onSuccess: async () => {
      await uploadImage({
        username: user.username,
        imageFile: userSelfEditForm.getValues('image'),
      }).finally(() => {
        router.refresh()
        onSubmit()
      })
    },
  })

  const onSubmitUserSelfEditForm = async (
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
    <Form {...userSelfEditForm}>
      <form
        className="flex flex-col gap-3"
        onSubmit={userSelfEditForm.handleSubmit(onSubmitUserSelfEditForm)}
      >
        <EditableAvatar form={userSelfEditForm} userAvatar={avatar} />
        <div className="flex w-full flex-1 flex-col items-center gap-1">
          <span className="font-semibold">{username}</span>
          <span className="text-sm font-normal">
            {mapUserRoleToLabel(role)}
          </span>
        </div>
        <Separator />
        <div className="flex gap-2">
          <FormField
            control={userSelfEditForm.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-full space-y-0.5">
                <FormControl>
                  <Input placeholder="Primeiro nome" autoFocus {...field} />
                </FormControl>
                <FormMessage className="font-light text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={userSelfEditForm.control}
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
          control={userSelfEditForm.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full space-y-0.5">
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage className="font-light text-red-500" />
            </FormItem>
          )}
        />
        <Accordion
          type="single"
          collapsible
          className="w-full overflow-hidden rounded-md border border-input"
        >
          <AccordionItem
            value="edit-password"
            className="border-none px-2 data-[state='open']:bg-accent"
          >
            <AccordionTrigger className="py-2 text-primary/75">
              Editar senha?
            </AccordionTrigger>
            <AccordionContent className="p-[1px] pb-0">
              <div className="flex gap-2">
                <FormField
                  control={userSelfEditForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full space-y-0.5">
                      <FormControl>
                        <Input
                          className="bg-white"
                          type="password"
                          placeholder="Nova senha"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="font-light text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={userSelfEditForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="w-full space-y-0.5">
                      <FormControl>
                        <Input
                          className="bg-white"
                          type="password"
                          placeholder="Confirmar nova senha"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="font-light text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <DialogFooter>
          <Button
            type={isLoading ? 'button' : 'submit'}
            className="flex w-full flex-row gap-2 data-[loading=true]:cursor-not-allowed"
            data-loading={isLoading}
            disabled={isLoading}
          >
            {isLoading && <Spinner />}
            {isLoading ? 'Processando...' : 'Salvar Alterações'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
