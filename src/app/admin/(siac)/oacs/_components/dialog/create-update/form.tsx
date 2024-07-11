'use client'

import { oacCreateFormSchema } from '@/schemas/siac'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { OAC } from '@/types/siac'
import { DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import DialogSubmitButton from '@/app/admin/_components/dialog-submit-button'
import FormInputLabel from '@/app/admin/_components/form-input-label'

import { useFormSubmit } from './hooks'

type CreateUpdateDialogProps = {
  oac?: OAC
  onClose: () => void
}

export default function CreateUpdateForm({ oac, onClose }: CreateUpdateDialogProps) {
  const isEditing = !!oac

  const createForm = useForm<z.infer<typeof oacCreateFormSchema>>({
    resolver: zodResolver(oacCreateFormSchema),
    defaultValues: {
      name: oac?.name || '',
    },
  })

  const { handleSubmit, isSubmiting } = useFormSubmit({
    oac,
    isEditing,
    onClose,
  })

  return (
    <Form {...createForm}>
      <form className="flex flex-col gap-3" onSubmit={createForm.handleSubmit(handleSubmit)}>
        <FormField
          control={createForm.control}
          name="name"
          render={({ field }) => (
            <div className="relative w-full">
              <FormInputLabel label="Nome" />
              <FormItem className="w-full space-y-0.5">
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage className="font-light text-red-500" />
              </FormItem>
            </div>
          )}
        />
        <DialogFooter>
          <DialogSubmitButton isUpdating={isEditing} isLoading={isSubmiting} subject="OAC" />
        </DialogFooter>
      </form>
    </Form>
  )
}
