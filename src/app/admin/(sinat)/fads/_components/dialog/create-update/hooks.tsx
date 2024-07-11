'use client'

import { useState } from 'react'
import { fadCreateFormSchema } from '@/schemas/sinat'
import { api } from '@/trpc/react'
import { z } from 'zod'

import { FAD } from '@/types/sinat'
import { toast } from '@/components/ui/use-toast'

type FormSubmitProps = {
  fad?: FAD
  isEditing: boolean
  onClose: () => void
}

export function useFormSubmit({ fad, isEditing, onClose }: FormSubmitProps) {
  const [isSubmiting, setIsSubmiting] = useState(false)
  const { mutateAsync: createFAD } = api.fad.create.useMutation({
    onSuccess: () => {
      onClose()
      setIsSubmiting(false)
    },
  })
  const { mutateAsync: updateFAD } = api.fad.update.useMutation({
    onSuccess: () => {
      onClose()
      setIsSubmiting(false)
    },
  })
  async function handleSubmit(values: z.infer<typeof fadCreateFormSchema>) {
    setIsSubmiting(true)
    try {
      if (isEditing && fad) {
        updateFAD({ id: fad.id, ...values })
      } else {
        createFAD(values)
      }

      toast({
        title: `FAD ${isEditing ? 'atualizada' : 'criada'} com sucesso`,
        description: (
          <div className="mt-1 rounded-md">
            <span>
              A FAD <strong>{values.name}</strong> foi {isEditing ? 'atualizada' : 'cadastrada'} com
              sucesso.
            </span>
          </div>
        ),
        status: 'success',
      })
    } catch (error) {
      toast({
        title: `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} FAD`,
        description: (
          <div className="mt-1 rounded-md">
            <span>
              Ocorreu um erro ao {isEditing ? 'atualizar' : 'cadastrar'} a FAD{' '}
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
