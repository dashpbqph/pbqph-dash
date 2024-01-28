'use client'

import { useState } from 'react'
import { projectCreateFormSchema } from '@/schemas/project'
import { api } from '@/trpc/react'
import { z } from 'zod'

import { toast } from '@/components/ui/use-toast'
import type { ProjectWithRelations } from '@/types/project'

type ProjectFormSubmitProps = {
  isEditing: boolean
  onClose: () => void
  project?: ProjectWithRelations
}

export function useProjectFormSubmit({
  isEditing,
  onClose,
  project,
}: ProjectFormSubmitProps) {
  const [isSubmiting, setIsSubmiting] = useState(false)
  const { mutateAsync: createProject } = api.project.create.useMutation({
    onSuccess: onClose,
  })
  const { mutateAsync: updateProject } = api.project.update.useMutation({
    onSuccess: onClose,
  })
  async function handleSubmit(values: z.infer<typeof projectCreateFormSchema>) {
    setIsSubmiting(true)
    try {
      if (isEditing && project) {
        updateProject({ id: project.id, ...values })
      } else {
        createProject({ ...values, companyId: values.company })
      }

      toast({
        title: `Obra ${isEditing ? 'atualizada' : 'criada'} com sucesso`,
        description: (
          <div className="mt-1 rounded-md">
            <span>
              A obra <strong>{values.name}</strong> foi{' '}
              {isEditing ? 'atualizada' : 'cadastrada'} com sucesso.
            </span>
          </div>
        ),
        status: 'success',
      })
    } catch (error) {
      toast({
        title: `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} obra`,
        description: (
          <div className="mt-1 rounded-md">
            <span>
              Ocorreu um erro ao {isEditing ? 'atualizar' : 'cadastrar'} a obra{' '}
              <strong>{values.name}</strong>.
            </span>
          </div>
        ),
        status: 'error',
      })
    }
    setIsSubmiting(false)
  }
  return { handleSubmit, isSubmiting }
}
