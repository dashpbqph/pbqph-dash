'use client'

import { useState } from 'react'
import { egtCreateFormSchema } from '@/schemas/simac'
import { api } from '@/trpc/react'
import { z } from 'zod'

import { EGT } from '@/types/simac'
import { toast } from '@/components/ui/use-toast'

type FormSubmitProps = {
  egt?: EGT
  isEditing: boolean
  onClose: () => void
}

export function useFormSubmit({ egt, isEditing, onClose }: FormSubmitProps) {
  const [isSubmiting, setIsSubmiting] = useState(false)
  const { mutateAsync: createEGT } = api.egt.create.useMutation({
    onSuccess: () => {
      onClose()
      setIsSubmiting(false)
    },
  })
  const { mutateAsync: updateEGT } = api.egt.update.useMutation({
    onSuccess: () => {
      onClose()
      setIsSubmiting(false)
    },
  })
  async function handleSubmit(values: z.infer<typeof egtCreateFormSchema>) {
    setIsSubmiting(true)
    try {
      if (isEditing && egt) {
        updateEGT({ id: egt.id, ...values })
      } else {
        createEGT(values)
      }

      toast({
        title: `EGT ${isEditing ? 'atualizada' : 'criada'} com sucesso`,
        description: (
          <div className="mt-1 rounded-md">
            <span>
              A EGT <strong>{values.name}</strong> foi {isEditing ? 'atualizada' : 'cadastrada'} com
              sucesso.
            </span>
          </div>
        ),
        status: 'success',
      })
    } catch (error) {
      toast({
        title: `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} EGT`,
        description: (
          <div className="mt-1 rounded-md">
            <span>
              Ocorreu um erro ao {isEditing ? 'atualizar' : 'cadastrar'} a EGT{' '}
              <strong>{values.name}</strong>.
            </span>
          </div>
        ),
        status: 'error',
      })
    }
  }
  return { handleSubmit, isSubmiting }
}
