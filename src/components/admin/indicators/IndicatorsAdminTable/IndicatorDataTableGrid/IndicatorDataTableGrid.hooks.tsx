import { useState } from 'react'
import { getDynamicIndicatorCRUDFormSchema } from '@/schemas/indicator'
import { api } from '@/trpc/react'
import { z } from 'zod'

import { toast } from '@/components/ui/use-toast'
import { IndicatorWithRelations } from '@/types/indicator'

// form submit hook
type IndicatorCRUDFormSubmitProps = {
  indicator: IndicatorWithRelations
  onClose: () => void
}

export function useIndicatorCRUDFormSubmit({
  indicator,
  onClose,
}: IndicatorCRUDFormSubmitProps) {
  const [isSubmiting, setIsSubmiting] = useState(false)
  const { mutateAsync: upsertValues } = api.indicator.upsertValues.useMutation({
    onSuccess: () => {
      setIsSubmiting(false)
      onClose()
    },
  })

  const indicatorCRUDFormSchema = getDynamicIndicatorCRUDFormSchema(indicator)
  async function handleSubmit(values: z.infer<typeof indicatorCRUDFormSchema>) {
    const isValuesValid = indicatorCRUDFormSchema.safeParse(values)
    if (!isValuesValid.success) {
      toast({
        title: 'Erro ao salvar',
        description: 'Verifique os campos e tente novamente',
        status: 'error',
      })

      return null
    }

    setIsSubmiting(true)
    await upsertValues({
      indicatorId: indicator.id,
      values,
    })

    toast({
      title: 'Salvo com sucesso',
      description: 'Os dados do indicador foram salvos com sucesso',
      status: 'success',
    })
    return null
  }

  return {
    handleSubmit,
    isSubmiting,
  }
}
