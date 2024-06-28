'use client'

import { useState } from 'react'
import { datecCreateFormSchema } from '@/schemas/sinat'
import { api } from '@/trpc/react'
import { z } from 'zod'

import { DATEC } from '@/types/sinat'
import { toast } from '@/components/ui/use-toast'

type FormSubmitProps = {
  datec?: DATEC
  isEditing: boolean
  onClose: () => void
}

export function useFormSubmit({ datec, isEditing, onClose }: FormSubmitProps) {
  const [isSubmiting, setIsSubmiting] = useState(false)
  const { mutateAsync: createDATEC } = api.datec.create.useMutation({
    onSuccess: () => {
      onClose()
      setIsSubmiting(false)
    },
  })
  const { mutateAsync: updateDATEC } = api.datec.update.useMutation({
    onSuccess: () => {
      onClose()
      setIsSubmiting(false)
    },
  })
  async function handleSubmit(values: z.infer<typeof datecCreateFormSchema>) {
    setIsSubmiting(true)
    try {
      if (isEditing && datec) {
        updateDATEC({ id: datec.id, ...values })
      } else {
        createDATEC(values)
      }

      toast({
        title: `DATEC ${isEditing ? 'atualizado' : 'criado'} com sucesso`,
        description: (
          <div className="mt-1 rounded-md">
            <span>
              O DATEC <strong>{values.name}</strong> foi {isEditing ? 'atualizado' : 'cadastrado'}{' '}
              com sucesso.
            </span>
          </div>
        ),
        status: 'success',
      })
    } catch (error) {
      toast({
        title: `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} DATEC`,
        description: (
          <div className="mt-1 rounded-md">
            <span>
              Ocorreu um erro ao {isEditing ? 'atualizar' : 'cadastrar'} o DATEC{' '}
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
