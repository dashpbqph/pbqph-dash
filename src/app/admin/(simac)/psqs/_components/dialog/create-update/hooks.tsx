'use client'

import { useState } from 'react'
import { psqCreateFormSchema } from '@/schemas/simac'
import { api } from '@/trpc/react'
import { z } from 'zod'

import { PSQ } from '@/types/simac'
import { toast } from '@/components/ui/use-toast'

type FormSubmitProps = {
  psq?: PSQ
  isEditing: boolean
  onClose: () => void
}

export function useFormSubmit({ psq, isEditing, onClose }: FormSubmitProps) {
  const [isSubmiting, setIsSubmiting] = useState(false)
  const { mutateAsync: createPSQ } = api.psq.create.useMutation({
    onSuccess: () => {
      onClose()
      setIsSubmiting(false)
    },
  })
  const { mutateAsync: updatePSQ } = api.psq.update.useMutation({
    onSuccess: () => {
      onClose()
      setIsSubmiting(false)
    },
  })
  async function handleSubmit(values: z.infer<typeof psqCreateFormSchema>) {
    setIsSubmiting(true)
    try {
      if (isEditing && psq) {
        updatePSQ({ id: psq.id, ...values })
      } else {
        createPSQ(values)
      }

      toast({
        title: `PSQ ${isEditing ? 'atualizado' : 'criado'} com sucesso`,
        description: (
          <div className="mt-1 rounded-md">
            <span>
              O PSQ <strong>{values.name}</strong> foi {isEditing ? 'atualizada' : 'cadastrada'} com
              sucesso.
            </span>
          </div>
        ),
        status: 'success',
      })
    } catch (error) {
      toast({
        title: `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} PSQ`,
        description: (
          <div className="mt-1 rounded-md">
            <span>
              Ocorreu um erro ao {isEditing ? 'atualizar' : 'cadastrar'} o PSQ{' '}
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
