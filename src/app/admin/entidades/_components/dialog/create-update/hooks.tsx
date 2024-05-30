'use client'

import { useState } from 'react'
import { entityCreateFormSchema } from '@/schemas/entity'
import { api } from '@/trpc/react'
import { z } from 'zod'

import { Entity } from '@/types/entity'
import { toast } from '@/components/ui/use-toast'

type EntityFormSubmitProps = {
  entity?: Entity
  isEditing: boolean
  onClose: () => void
}

export function useEntityFormSubmit({ entity, isEditing, onClose }: EntityFormSubmitProps) {
  const [isSubmiting, setIsSubmiting] = useState(false)
  const { mutateAsync: createEntity } = api.entity.create.useMutation({
    onSuccess: () => {
      onClose()
      setIsSubmiting(false)
    },
  })
  const { mutateAsync: updateEntity } = api.entity.update.useMutation({
    onSuccess: () => {
      onClose()
      setIsSubmiting(false)
    },
  })
  async function handleSubmit(values: z.infer<typeof entityCreateFormSchema>) {
    setIsSubmiting(true)
    try {
      if (isEditing && entity) {
        updateEntity({ id: entity.id, ...values })
      } else {
        createEntity(values)
      }

      toast({
        title: `Entidade ${isEditing ? 'atualizada' : 'criada'} com sucesso`,
        description: (
          <div className="mt-1 rounded-md">
            <span>
              A entidade <strong>{values.name}</strong> foi{' '}
              {isEditing ? 'atualizada' : 'cadastrada'} com sucesso.
            </span>
          </div>
        ),
        status: 'success',
      })
    } catch (error) {
      toast({
        title: `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} entidade`,
        description: (
          <div className="mt-1 rounded-md">
            <span>
              Ocorreu um erro ao {isEditing ? 'atualizar' : 'cadastrar'} a entidade{' '}
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
