import { indicatorCreateUpdateFormSchema } from '@/schemas/indicator'
import { api } from '@/trpc/react'
import type { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { toast } from '@/components/ui/use-toast'
import type { IndicatorWithRelations } from '@/types/indicator'

// ai hook

type UseIndicatorAiProps = {
  indicatorCreateUpdateForm: UseFormReturn<
    z.infer<typeof indicatorCreateUpdateFormSchema>
  >
}

export function useIndicatorAi({
  indicatorCreateUpdateForm,
}: UseIndicatorAiProps) {
  const { mutateAsync: textToEquationMutation } =
    api.openai.textToEquation.useMutation()
  const { mutateAsync: textToUnitMutation } =
    api.openai.textToUnit.useMutation()

  async function textToEquation(column: 'code' | 'equation') {
    const equation = indicatorCreateUpdateForm.getValues(column)
    const output = await textToEquationMutation({ text: equation })
    if (column === 'code') {
      indicatorCreateUpdateForm.setValue('equation', `${output}=`)
    }
    indicatorCreateUpdateForm.setValue(column, output)
  }

  async function textToUnit() {
    const unit = indicatorCreateUpdateForm.getValues('unit')
    const output = await textToUnitMutation({ text: unit })
    indicatorCreateUpdateForm.setValue('unit', output)
  }

  return {
    textToEquation,
    textToUnit,
  }
}

// form submit hook

type UseIndicatorSubmitProps = {
  indicator?: IndicatorWithRelations
  indicatorCreateUpdateForm: UseFormReturn<
    z.infer<typeof indicatorCreateUpdateFormSchema>
  >
  isEditing: boolean
  onClose: () => void
}

export function useIndicatorSubmit({
  indicator,
  isEditing,
  onClose,
}: UseIndicatorSubmitProps) {
  const { mutateAsync: createIndicator } = api.indicator.create.useMutation({
    onSuccess: onClose,
  })
  const { mutateAsync: updateIndicator } = api.indicator.update.useMutation({
    onSuccess: onClose,
  })

  async function handleSubmit(
    values: z.infer<typeof indicatorCreateUpdateFormSchema>,
  ) {
    try {
      if (isEditing && indicator) {
        updateIndicator({ id: indicator.id, ...values })
      } else {
        createIndicator({ ...values })
      }

      toast({
        title: `Indicador ${isEditing ? 'atualizado' : 'criado'} com sucesso`,
        status: 'success',
      })
    } catch (error) {
      toast({
        title: `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} obra`,
        description: (
          <div className="mt-1 rounded-md">
            <span>
              Verifique se os campos foram preenchidos corretamente e tente
              novamente.
            </span>
          </div>
        ),
        status: 'error',
      })
    }
  }

  return {
    handleSubmit,
  }
}
