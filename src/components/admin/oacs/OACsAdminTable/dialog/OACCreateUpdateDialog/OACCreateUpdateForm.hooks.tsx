'use client'

import { useState } from 'react'
import { oacCreateFormSchema } from '@/schemas/oac'
import { api } from '@/trpc/react'
import { z } from 'zod'

import { toast } from '@/components/ui/use-toast'
import type { OAC } from '@/types/oac'

type OACFormSubmitProps = {
  oac?: OAC
  isEditing: boolean
  onClose: () => void
}

export function useOACFormSubmit({
  oac,
  isEditing,
  onClose,
}: OACFormSubmitProps) {
  const [isSubmiting, setIsSubmiting] = useState(false)
  const { mutateAsync: createOAC } = api.oac.create.useMutation({
    onSuccess: () => {
      onClose()
      setIsSubmiting(false)
    },
  })
  const { mutateAsync: updateOAC } = api.oac.update.useMutation({
    onSuccess: () => {
      onClose()
      setIsSubmiting(false)
    },
  })
  async function handleSubmit(values: z.infer<typeof oacCreateFormSchema>) {
    setIsSubmiting(true)
    try {
      if (isEditing && oac) {
        updateOAC({ id: oac.id, ...values })
      } else {
        createOAC(values)
      }

      toast({
        title: `OAC ${isEditing ? 'atualizada' : 'criada'} com sucesso`,
        description: (
          <div className="mt-1 rounded-md">
            <span>
              O OAC <strong>{values.name}</strong> foi{' '}
              {isEditing ? 'atualizada' : 'cadastrada'} com sucesso.
            </span>
          </div>
        ),
        status: 'success',
      })
    } catch (error) {
      toast({
        title: `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} OAC`,
        description: (
          <div className="mt-1 rounded-md">
            <span>
              Ocorreu um erro ao {isEditing ? 'atualizar' : 'cadastrar'} o OAC{' '}
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
