'use client'

import { oacCreateFormSchema } from '@/schemas/oac'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { DialogButtonSubmit } from '@/components/shared/dialog'
import { DialogFooter } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { OAC } from '@/types/oac'
import { useOACFormSubmit } from './OACCreateUpdateForm.hooks'

type OACCreateUpdateDialogProps = {
  oac?: OAC
  onClose: () => void
}

export default function OACCreateUpdateForm({
  oac,
  onClose,
}: OACCreateUpdateDialogProps) {
  const isEditing = !!oac

  const oacCreateForm = useForm<z.infer<typeof oacCreateFormSchema>>({
    resolver: zodResolver(oacCreateFormSchema),
    defaultValues: {
      name: oac?.name || '',
      description: oac?.description || '',
    },
  })

  const { handleSubmit, isSubmiting } = useOACFormSubmit({
    oac,
    isEditing,
    onClose,
  })

  return (
    <Form {...oacCreateForm}>
      <form
        className="flex flex-col gap-3"
        onSubmit={oacCreateForm.handleSubmit(handleSubmit)}
      >
        <FormField
          control={oacCreateForm.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full space-y-0.5">
              <FormControl>
                <Input placeholder="Nome*" {...field} />
              </FormControl>
              <FormMessage className="font-light text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={oacCreateForm.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full space-y-0.5">
              <FormControl>
                <Textarea
                  className="h-24 resize-none"
                  placeholder="Descrição"
                  {...field}
                />
              </FormControl>
              <FormMessage className="font-light text-red-500" />
            </FormItem>
          )}
        />
        <DialogFooter>
          <DialogButtonSubmit
            isUpdating={isEditing}
            isLoading={isSubmiting}
            subject="OAC"
          />
        </DialogFooter>
      </form>
    </Form>
  )
}
