import { useState } from 'react'
import { indicatorCRUDFormSchema } from '@/schemas/indicator'
import { z } from 'zod'

import { toast } from '@/components/ui/use-toast'
import { IndicatorWithRelations } from '@/types/indicator'

// form submit hook
type IndicatorCRUDFormSubmitProps = {
  indicator?: IndicatorWithRelations
  onClose: () => void
}

export function useIndicatorCRUDFormSubmit({
  indicator,
  onClose,
}: IndicatorCRUDFormSubmitProps) {
  const [isSubmiting, setIsSubmiting] = useState(false)
  // const { mutateAsync: updateIndicator } = api.indicator.update.useMutation({
  //   onSuccess: onClose,
  // })

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
