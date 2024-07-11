'use client'

import { datecCreateFormSchema } from '@/schemas/sinat'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { DATEC } from '@/types/sinat'
import { DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import DialogSubmitButton from '@/app/admin/_components/dialog-submit-button'
import FormInputLabel from '@/app/admin/_components/form-input-label'

import { useFormSubmit } from './hooks'

type CreateUpdateDialogProps = {
  datec?: DATEC
  onClose: () => void
}

export default function CreateUpdateForm({ datec, onClose }: CreateUpdateDialogProps) {
  const isEditing = !!datec

  const createForm = useForm<z.infer<typeof datecCreateFormSchema>>({
    resolver: zodResolver(datecCreateFormSchema),
    defaultValues: {
      name: datec?.name || '',
    },
  })

  const { handleSubmit, isSubmiting } = useFormSubmit({
    datec,
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
          <DialogSubmitButton isUpdating={isEditing} isLoading={isSubmiting} subject="DATEC" />
        </DialogFooter>
      </form>
    </Form>
  )
}
