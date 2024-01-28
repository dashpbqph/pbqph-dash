'use client'

import { useState } from 'react'
import { companyCreateFormSchema } from '@/schemas/company'
import { api } from '@/trpc/react'
import { z } from 'zod'

import { toast } from '@/components/ui/use-toast'
import type { Company } from '@/types/company'

type CompanyFormSubmitProps = {
  company?: Company
  isEditing: boolean
  onClose: () => void
}

export function useCompanyFormSubmit({
  company,
  isEditing,
  onClose,
}: CompanyFormSubmitProps) {
  const [isSubmiting, setIsSubmiting] = useState(false)
  const { mutateAsync: createCompany } = api.company.create.useMutation({
    onSuccess: onClose,
  })
  const { mutateAsync: updateCompany } = api.company.update.useMutation({
    onSuccess: onClose,
  })
  async function handleSubmit(values: z.infer<typeof companyCreateFormSchema>) {
    setIsSubmiting(true)
    try {
      if (isEditing && company) {
        updateCompany({ id: company.id, ...values })
      } else {
        createCompany(values)
      }

      toast({
        title: `Construtora ${isEditing ? 'atualizada' : 'criada'} com sucesso`,
        description: (
          <div className="mt-1 rounded-md">
            <span>
              A construtora <strong>{values.name}</strong> foi{' '}
              {isEditing ? 'atualizada' : 'cadastrada'} com sucesso.
            </span>
          </div>
        ),
        status: 'success',
      })
    } catch (error) {
      toast({
        title: `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} construtora`,
        description: (
          <div className="mt-1 rounded-md">
            <span>
              Ocorreu um erro ao {isEditing ? 'atualizar' : 'cadastrar'} a
              construtora <strong>{values.name}</strong>.
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
