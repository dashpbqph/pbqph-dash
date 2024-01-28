'use client'

import { useState } from 'react'
import { indicatorCreateUpdateFormSchema } from '@/schemas/indicator'
import { api } from '@/trpc/react'
import type { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { toast } from '@/components/ui/use-toast'
import type { IndicatorWithRelations, Tab } from '@/types/indicator'
import { steps } from './IndicatorCreateUpdateForm.constants'

// ai hook

type IndicatorAiProps = {
  indicatorCreateUpdateForm: UseFormReturn<
    z.infer<typeof indicatorCreateUpdateFormSchema>
  >
}

export function useIndicatorAi({
  indicatorCreateUpdateForm,
}: IndicatorAiProps) {
  const [isSubmiting, setIsSubmiting] = useState(false)
  const { mutateAsync: textToEquationMutation } =
    api.openai.textToEquation.useMutation()
  const { mutateAsync: textToUnitMutation } =
    api.openai.textToUnit.useMutation()

  async function textToEquation(column: 'code' | 'equation') {
    setIsSubmiting(true)
    const equation = indicatorCreateUpdateForm.getValues(column)
    const output = await textToEquationMutation({ text: equation })
    if (column === 'code') {
      indicatorCreateUpdateForm.setValue('equation', `${output}=`)
    }
    indicatorCreateUpdateForm.setValue(column, output)
    setIsSubmiting(false)
  }

  async function textToUnit() {
    setIsSubmiting(true)
    const unit = indicatorCreateUpdateForm.getValues('unit')
    const output = await textToUnitMutation({ text: unit })
    indicatorCreateUpdateForm.setValue('unit', output)
    setIsSubmiting(false)
  }

  return {
    textToEquation,
    textToUnit,
    isSubmiting,
  }
}

// tabs hook
type FieldName = keyof z.infer<typeof indicatorCreateUpdateFormSchema>
type IndicatorFormTabsProps = {
  indicatorCreateUpdateForm: UseFormReturn<
    z.infer<typeof indicatorCreateUpdateFormSchema>
  >
}

export function useIndicatorFormTabs({
  indicatorCreateUpdateForm,
}: IndicatorFormTabsProps) {
  const [currentTab, setCurrentTab] = useState<Tab>('basic')
  async function handleTab(tab: Tab) {
    const fields = steps.find((step) => step.id === tab)?.fields
    const output = await indicatorCreateUpdateForm.trigger(
      fields as FieldName[],
      {
        shouldFocus: true,
      },
    )

    if (!output) return

    if (tab === 'basic') {
      setCurrentTab('formula')
    } else if (tab === 'formula') {
      setCurrentTab('stratification')
    }
  }

  return {
    handleTab,
    currentTab,
    setCurrentTab,
  }
}

// form submit hook

type IndicatorFormSubmitProps = {
  indicator?: IndicatorWithRelations
  indicatorCreateUpdateForm: UseFormReturn<
    z.infer<typeof indicatorCreateUpdateFormSchema>
  >
  isEditing: boolean
  onClose: () => void
}

export function useIndicatorFormSubmit({
  indicator,
  isEditing,
  onClose,
}: IndicatorFormSubmitProps) {
  const [isSubmiting, setIsSubmiting] = useState(false)
  const { mutateAsync: createIndicator } = api.indicator.create.useMutation({
    onSuccess: onClose,
  })
  const { mutateAsync: updateIndicator } = api.indicator.update.useMutation({
    onSuccess: onClose,
  })

  async function handleSubmit(
    values: z.infer<typeof indicatorCreateUpdateFormSchema>,
  ) {
    setIsSubmiting(true)
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
    setIsSubmiting(false)
  }

  return {
    handleSubmit,
    isSubmiting,
  }
}
