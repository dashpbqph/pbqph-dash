'use client'

import { useState } from 'react'
import { itaCreateFormSchema } from '@/schemas/sinat'
import { api } from '@/trpc/react'
import { z } from 'zod'

import { ITA } from '@/types/sinat'
import { toast } from '@/components/ui/use-toast'

type FormSubmitProps = {
  ita?: ITA
  isEditing: boolean
  onClose: () => void
}

export function useFormSubmit({ ita, isEditing, onClose }: FormSubmitProps) {
  const [isSubmiting, setIsSubmiting] = useState(false)
  const { mutateAsync: createITA } = api.ita.create.useMutation({
    onSuccess: () => {
      onClose()
      setIsSubmiting(false)
    },
  })
  const { mutateAsync: updateITA } = api.ita.update.useMutation({
    onSuccess: () => {
      onClose()
      setIsSubmiting(false)
    },
  })
  async function handleSubmit(values: z.infer<typeof itaCreateFormSchema>) {
    setIsSubmiting(true)
    try {
      if (isEditing && ita) {
        updateITA({ id: ita.id, ...values })
      } else {
        createITA(values)
      }

      toast({
        title: `ITA ${isEditing ? 'atualizada' : 'criada'} com sucesso`,
        description: (
          <div className="mt-1 rounded-md">
            <span>
              A ITA <strong>{values.name}</strong> foi {isEditing ? 'atualizada' : 'cadastrada'} com
              sucesso.
            </span>
          </div>
        ),
        status: 'success',
      })
    } catch (error) {
      toast({
        title: `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} ITA`,
        description: (
          <div className="mt-1 rounded-md">
            <span>
              Ocorreu um erro ao {isEditing ? 'atualizar' : 'cadastrar'} a ITA{' '}
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
