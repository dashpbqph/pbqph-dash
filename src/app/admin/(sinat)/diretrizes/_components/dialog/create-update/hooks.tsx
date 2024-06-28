'use client'

import { useState } from 'react'
import { guidelineCreateFormSchema } from '@/schemas/sinat'
import { api } from '@/trpc/react'
import { z } from 'zod'

import { Guideline } from '@/types/sinat'
import { toast } from '@/components/ui/use-toast'

type FormSubmitProps = {
  guideline?: Guideline
  isEditing: boolean
  onClose: () => void
}

export function useFormSubmit({ guideline, isEditing, onClose }: FormSubmitProps) {
  const [isSubmiting, setIsSubmiting] = useState(false)
  const { mutateAsync: createGuideline } = api.guideline.create.useMutation({
    onSuccess: () => {
      onClose()
      setIsSubmiting(false)
    },
  })
  const { mutateAsync: updateGuideline } = api.guideline.update.useMutation({
    onSuccess: () => {
      onClose()
      setIsSubmiting(false)
    },
  })
  async function handleSubmit(values: z.infer<typeof guidelineCreateFormSchema>) {
    setIsSubmiting(true)
    try {
      if (isEditing && guideline) {
        updateGuideline({ id: guideline.id, ...values })
      } else {
        createGuideline(values)
      }

      toast({
        title: `Diretriz ${isEditing ? 'atualizada' : 'criada'} com sucesso`,
        description: (
          <div className="mt-1 rounded-md">
            <span>
              A diretriz <strong>{values.name}</strong> foi{' '}
              {isEditing ? 'atualizada' : 'cadastrada'} com sucesso.
            </span>
          </div>
        ),
        status: 'success',
      })
    } catch (error) {
      toast({
        title: `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} diretriz`,
        description: (
          <div className="mt-1 rounded-md">
            <span>
              Ocorreu um erro ao {isEditing ? 'atualizar' : 'cadastrar'} a diretriz{' '}
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
