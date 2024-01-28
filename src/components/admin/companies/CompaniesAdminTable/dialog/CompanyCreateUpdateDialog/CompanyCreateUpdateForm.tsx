'use client'

import { companyCreateFormSchema } from '@/schemas/company'
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
import type { Company } from '@/types/company'
import { useCompanyFormSubmit } from './CompanyCreateUpdateForm.hooks'

type CompanyCreateUpdateDialogProps = {
  company?: Company
  onClose: () => void
}

export default function CompanyCreateUpdateForm({
  company,
  onClose,
}: CompanyCreateUpdateDialogProps) {
  const isEditing = !!company

  const companyCreateForm = useForm<z.infer<typeof companyCreateFormSchema>>({
    resolver: zodResolver(companyCreateFormSchema),
    defaultValues: {
      name: company?.name || '',
      description: company?.description || '',
    },
  })

  const { handleSubmit, isSubmiting } = useCompanyFormSubmit({
    company,
    isEditing,
    onClose,
  })

  return (
    <Form {...companyCreateForm}>
      <form
        className="flex flex-col gap-3"
        onSubmit={companyCreateForm.handleSubmit(handleSubmit)}
      >
        <FormField
          control={companyCreateForm.control}
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
          control={companyCreateForm.control}
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
          <DialogButtonSubmit isLoading={isSubmiting} subject="construtora" />
        </DialogFooter>
      </form>
    </Form>
  )
}
