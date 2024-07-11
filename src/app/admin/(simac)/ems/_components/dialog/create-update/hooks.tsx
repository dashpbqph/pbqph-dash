'use client'

import { useState } from 'react'
import { emCreateFormSchema } from '@/schemas/simac'
import { api } from '@/trpc/react'
import { z } from 'zod'

import { EM } from '@/types/simac'
import { toast } from '@/components/ui/use-toast'

type FormSubmitProps = {
  em?: EM
  isEditing: boolean
  onClose: () => void
}

export function useFormSubmit({ em, isEditing, onClose }: FormSubmitProps) {
  const [isSubmiting, setIsSubmiting] = useState(false)
  const { mutateAsync: createEM } = api.em.create.useMutation({
    onSuccess: () => {
      onClose()
      setIsSubmiting(false)
    },
  })
  const { mutateAsync: updateEM } = api.em.update.useMutation({
    onSuccess: () => {
      onClose()
      setIsSubmiting(false)
    },
  })
  async function handleSubmit(values: z.infer<typeof emCreateFormSchema>) {
    setIsSubmiting(true)
    try {
      if (isEditing && em) {
        updateEM({ id: em.id, ...values })
      } else {
        createEM(values)
      }

      toast({
        title: `EM ${isEditing ? 'atualizada' : 'criada'} com sucesso`,
        description: (
          <div className="mt-1 rounded-md">
            <span>
              A EM <strong>{values.name}</strong> foi {isEditing ? 'atualizada' : 'cadastrada'} com
              sucesso.
            </span>
          </div>
        ),
        status: 'success',
      })
    } catch (error) {
      toast({
        title: `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} EM`,
        description: (
          <div className="mt-1 rounded-md">
            <span>
              Ocorreu um erro ao {isEditing ? 'atualizar' : 'cadastrar'} a EM{' '}
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
