'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  userCreateUpdateFormSchema,
  userCreateUpdateFormSchemaOptionalPassword,
} from '@/schemas/user'
import { api } from '@/trpc/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserRole } from '@prisma/client'
import { Camera, ClipboardCopy, RefreshCw } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import type { User } from '@/types/user'
import { mapUserRoleToLabel } from '@/utils/auth'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DialogFooter } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import DialogSubmitButton from '@/app/admin/_components/dialog-submit-button'
import FormInputLabel from '@/app/admin/_components/form-input-label'

import { useImageUpload, usePasswordManagement, useUserFormSubmit } from './hooks'

type UserCreateUpdateFormProps = {
  user?: User
  onClose: () => void
  refetchUsers: () => void
}

export default function UserCreateUpdateForm({
  user,
  onClose,
  refetchUsers,
}: UserCreateUpdateFormProps) {
  const isEditing = !!user
  const avatarSeed = crypto.randomUUID()
  const { data: companies } = api.company.getAll.useQuery()

  const formSchema = isEditing
    ? userCreateUpdateFormSchemaOptionalPassword
    : userCreateUpdateFormSchema

  const userCreateUpdateForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.username || '',
      password: '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      image: new File([], user?.avatar || ''),
      userHasCompany: !!user?.company.id,
      companyId: user?.company.id || '',
      role: user?.role || UserRole.MEMBER,
    },
  })

  const { addImage } = useImageUpload({
    avatarSeed,
    userCreateUpdateForm,
  })

  const { handleGeneratePassword, handleCopyPassword } = usePasswordManagement({
    userCreateUpdateForm,
  })

  const { handleSubmit, isSubmiting } = useUserFormSubmit({
    user,
    userCreateUpdateForm,
    avatarSeed,
    isEditing,
    onClose,
    refetchUsers,
  })

  const [avatarVisible, setAvatarVisible] = useState(false)

  return (
    <Form {...userCreateUpdateForm}>
      <form
        className="flex flex-col gap-3"
        onSubmit={userCreateUpdateForm.handleSubmit(handleSubmit)}
      >
        <div className="flex gap-3">
          <button
            type="button"
            className="group relative flex h-[85px] w-[85px] items-center justify-center overflow-hidden rounded-full bg-gray-400 data-[avatarvisible=false]:animate-pulse"
            onClick={addImage}
            data-avatarvisible={isEditing || avatarVisible}
          >
            <Image
              src={
                isEditing
                  ? userCreateUpdateForm.watch('image').size === 0
                    ? userCreateUpdateForm.watch('image').name // string
                    : URL.createObjectURL(userCreateUpdateForm.watch('image')) // file
                  : URL.createObjectURL(userCreateUpdateForm.watch('image')) // file
              }
              alt=""
              fill
              style={{ objectFit: 'cover' }}
              sizes="25w"
              className="group-data-[avatarvisible=false]:hidden"
              onLoad={() => setAvatarVisible(true)}
            />
            <Camera className="relative z-10 hidden h-7 w-7 text-white transition-all group-hover:block" />
            <div className="absolute inset-0 bg-black bg-opacity-0 transition-all group-hover:bg-opacity-50" />
          </button>
          <div className="flex w-full flex-1 flex-col gap-3">
            <FormField
              control={userCreateUpdateForm.control}
              name="username"
              render={({ field }) => (
                <div className="relative w-full">
                  <FormInputLabel label="Nome de usuário" />
                  <FormItem className="w-full space-y-0.5">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="font-light text-red-500" />
                  </FormItem>
                </div>
              )}
            />
            <FormField
              control={userCreateUpdateForm.control}
              name="role"
              render={({ field }) => (
                <div className="relative w-full">
                  <FormInputLabel label="Nível de acesso" />
                  <FormItem className="grid w-full items-center gap-2.5">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
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
                </div>
              )}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <FormField
            control={userCreateUpdateForm.control}
            name="firstName"
            render={({ field }) => (
              <div className="relative w-full">
                <FormInputLabel label="Primeiro nome" />
                <FormItem className="w-full space-y-0.5">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="font-light text-red-500" />
                </FormItem>
              </div>
            )}
          />
          <FormField
            control={userCreateUpdateForm.control}
            name="lastName"
            render={({ field }) => (
              <div className="relative w-full">
                <FormInputLabel label="Último nome" />
                <FormItem className="w-full space-y-0.5">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="font-light text-red-500" />
                </FormItem>
              </div>
            )}
          />
        </div>
        <FormField
          control={userCreateUpdateForm.control}
          name="email"
          render={({ field }) => (
            <div className="relative w-full">
              <FormInputLabel label="Email" />
              <FormItem className="w-full space-y-0.5">
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage className="font-light text-red-500" />
              </FormItem>
            </div>
          )}
        />
        {!isEditing && (
          <div className="relative flex gap-2">
            <FormInputLabel label="Senha" />
            <Button
              type="button"
              className="flex-1 justify-start text-sm font-medium text-muted-foreground disabled:bg-gray-100 disabled:opacity-100"
              variant="outline"
              onClick={() => handleGeneratePassword({ renew: false })}
              disabled={userCreateUpdateForm.watch('password') !== ''}
            >
              {userCreateUpdateForm.watch('password') === ''
                ? 'Clique para gerar uma senha forte'
                : userCreateUpdateForm.getValues('password')}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="p-2"
              onClick={() => handleGeneratePassword({ renew: true })}
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
            <Button type="button" variant="outline" className="p-2" onClick={handleCopyPassword}>
              <ClipboardCopy className="h-5 w-5" />
            </Button>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <FormField
            control={userCreateUpdateForm.control}
            name="userHasCompany"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="font-normal leading-none">
                  Usuário associado a uma construtora?
                </FormLabel>
                <FormMessage className="font-light text-red-500" />
              </FormItem>
            )}
          />
          {userCreateUpdateForm.watch('userHasCompany') && (
            <FormField
              control={userCreateUpdateForm.control}
              name="companyId"
              render={({ field }) => (
                <FormItem className="grid w-full items-center space-y-0.5">
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Construtora" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companies?.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="font-light text-red-500" />
                </FormItem>
              )}
            />
          )}
        </div>
        <DialogFooter>
          <DialogSubmitButton isUpdating={isEditing} isLoading={isSubmiting} subject={'usuário'} />
        </DialogFooter>
      </form>
    </Form>
  )
}
