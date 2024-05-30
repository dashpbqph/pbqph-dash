/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import { indicatorCreateUpdateFormSchema } from '@/schemas/indicator'
import { api } from '@/trpc/react'
import { ImpactedAgent, ImpactNature } from '@prisma/client'
import type { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import type { IndicatorWithRelations, Tab } from '@/types/indicator'
import { toast } from '@/components/ui/use-toast'

import { steps } from './constants'

// tabs hook
type FieldName = keyof z.infer<typeof indicatorCreateUpdateFormSchema>
type IndicatorFormTabsProps = {
  indicatorCreateUpdateForm: UseFormReturn<z.infer<typeof indicatorCreateUpdateFormSchema>>
}

export function useIndicatorFormTabs({ indicatorCreateUpdateForm }: IndicatorFormTabsProps) {
  const [currentTab, setCurrentTab] = useState<Tab>('infos')

  async function handleTab(tab: Tab) {
    const currentTabIndex = steps.findIndex((step) => step.id === tab)
    const prevTabs = steps.slice(0, currentTabIndex)

    for (const prevTab of prevTabs) {
      const fields = prevTab.fields
      const output = await indicatorCreateUpdateForm.trigger(fields as FieldName[], {
        shouldFocus: true,
      })
      if (!output) {
        setCurrentTab(prevTab.id)
        return
      }
    }

    setCurrentTab(tab)
  }

  return { handleTab, currentTab, setCurrentTab }
}

// form submit hook

type IndicatorFormSubmitProps = {
  indicator?: IndicatorWithRelations
  indicatorCreateUpdateForm: UseFormReturn<z.infer<typeof indicatorCreateUpdateFormSchema>>
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

  async function handleSubmit(values: z.infer<typeof indicatorCreateUpdateFormSchema>) {
    const { impactNatures, impactedAgents, ...otherValues } = values
    setIsSubmiting(true)
    try {
      if (isEditing && indicator) {
        updateIndicator({
          id: indicator.id,
          impactNatures: values.impactNatures.map((impact) => impact.value as ImpactNature),
          impactedAgents: values.impactedAgents.map((impact) => impact.value as ImpactedAgent),
          ...otherValues,
        })
      } else {
        createIndicator({
          impactNatures: values.impactNatures.map((impact) => impact.value as ImpactNature),
          impactedAgents: values.impactedAgents.map((impact) => impact.value as ImpactedAgent),
          ...otherValues,
        })
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
            <span>Verifique se os campos foram preenchidos corretamente e tente novamente.</span>
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
