'use client'

import { useCallback, useEffect, useState } from 'react'
import { api } from '@/trpc/react'
import type { UseFormReturn } from 'react-hook-form'

import { toast } from '@/components/ui/use-toast'
import { generatePassword } from '@/utils/auth'
import { uploadFiles } from '@/utils/uploadthing'
import type { User, UserCreateUpdateFormSchemaUnion } from '@/types/user'

// image upload hook

type UploadImageProps = {
  username: string
  imageFile: File
}

export async function uploadImage({
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

type ImageUploadProps = {
  avatarSeed: string
  userCreateUpdateForm: UseFormReturn<UserCreateUpdateFormSchemaUnion>
}

export function useImageUpload({
  avatarSeed,
  userCreateUpdateForm,
}: ImageUploadProps) {
  const setImagePlaceholder = useCallback(async () => {
    const url = `https://api.dicebear.com/7.x/thumbs/png?seed=${avatarSeed}&backgroundColor=69d2e7&eyes=variant2W10,variant2W12,variant2W14,variant2W16,variant3W10,variant3W12,variant3W14,variant3W16,variant4W10,variant4W12,variant4W14,variant4W16,variant5W10,variant5W12,variant5W14,variant5W16,variant6W10,variant6W12,variant6W14,variant6W16,variant7W10,variant7W12,variant7W14,variant7W16,variant8W10,variant8W12,variant8W14,variant8W16,variant9W10,variant9W12,variant9W14,variant9W16&face=variant4,variant5,variant1,variant2,variant3&mouth=variant2,variant4,variant3`

    const response = await fetch(url)
    const blob = await response.blob()

    userCreateUpdateForm.setValue(
      'image',
      new File([blob], `${avatarSeed}.png`, { type: 'image/png' }),
    )
  }, [avatarSeed, userCreateUpdateForm])

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

        userCreateUpdateForm.setValue('image', imageFile)
      }
    })

    fileInput.click()
  }

  useEffect(() => {
    if (userCreateUpdateForm.getValues('image').name === '') {
      setImagePlaceholder()
    }
  }, [avatarSeed, setImagePlaceholder, userCreateUpdateForm])

  return {
    addImage,
  }
}

// password management hook

type PasswordManagementProps = {
  userCreateUpdateForm: UseFormReturn<UserCreateUpdateFormSchemaUnion>
}

export function usePasswordManagement({
  userCreateUpdateForm,
}: PasswordManagementProps) {
  const handleGeneratePassword = ({ renew = false }) => {
    if (renew || userCreateUpdateForm.getValues('password') === '') {
      userCreateUpdateForm.setValue('password', generatePassword())
    }
  }

  const handleCopyPassword = () => {
    if (userCreateUpdateForm.getValues('password') === '') return

    navigator.clipboard.writeText(
      (userCreateUpdateForm.getValues('password') || '') as string,
    )

    toast({
      title: 'Senha copiada',
      description: 'A senha foi copiada para a área de transferência.',
      status: 'info',
    })
  }

  return {
    handleGeneratePassword,
    handleCopyPassword,
  }
}

// user form submit hook

type UserFormSubmitProps = {
  user?: User
  userCreateUpdateForm: UseFormReturn<UserCreateUpdateFormSchemaUnion>
  avatarSeed: string
  isEditing: boolean
  onClose: () => void
}

export function useUserFormSubmit({
  user,
  userCreateUpdateForm,
  avatarSeed,
  isEditing,
  onClose,
}: UserFormSubmitProps) {
  const [isSubmiting, setIsSubmiting] = useState(false)
  const { mutateAsync: createUser } = api.user.create.useMutation({
    onSuccess: async ({ id, username }) => {
      const imageFile = userCreateUpdateForm.getValues('image')
      await uploadImage({
        username,
        imageFile: new File([imageFile], `${id}-${imageFile.name}`, {
          type: imageFile.type,
        }),
      }).finally(() => setTimeout(onClose, 500))
    },
  })

  const { mutateAsync: updateUser } = api.user.update.useMutation({
    onSuccess: async ({ id, username }) => {
      if (userCreateUpdateForm.getValues('image').size > 0) {
        const imageFile = userCreateUpdateForm.getValues('image')
        const fileExt = imageFile.name.split('.').pop()
        await uploadImage({
          username,
          imageFile: new File([imageFile], `${id}-${avatarSeed}.${fileExt}`, {
            type: imageFile.type,
          }),
        }).finally(() => setTimeout(onClose, 500))
      } else {
        onClose()
      }
    },
  })

  async function handleSubmit(values: UserCreateUpdateFormSchemaUnion) {
    setIsSubmiting(true)
    try {
      // create or update user
      if (isEditing && user) {
        if (userCreateUpdateForm.getValues('image').size > 0) {
          updateUser({
            id: user.id,
            ...values,
            image:
              userCreateUpdateForm.getValues('image').size > 0
                ? ''
                : user.avatar,
          })
        }
      } else {
        createUser({
          ...values,
          password: values.password as string,
          image: '', // placeholder, will be updated in the onSuccess callback
        })
      }

      toast({
        title: `Usuário ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso`,
        description: (
          <div className="mt-1 rounded-md">
            <span>
              O usuário <strong>{values.username}</strong> foi{' '}
              {isEditing ? 'atualizado' : 'cadastrado'} com sucesso.
            </span>
          </div>
        ),
        status: 'success',
      })
    } catch (error) {
      toast({
        title: `Erro ao ${isEditing ? 'editar' : 'cadastrar'} usuário`,
        description: (
          <div className="mt-1 rounded-md">
            <span>
              Ocorreu um erro ao {isEditing ? 'editar' : 'cadastrar'} o usuário{' '}
              <strong>{values.username}</strong>.
            </span>
          </div>
        ),
        status: 'error',
      })
    }
    setIsSubmiting(false)
  }

  return {
    handleSubmit,
    isSubmiting,
  }
}
