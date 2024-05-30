'use client'

import { companyCreateFormSchema } from '@/schemas/company'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import type { Company } from '@/types/company'
import { DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import DialogSubmitButton from '@/app/admin/_components/dialog-submit-button'
import FormInputLabel from '@/app/admin/_components/form-input-label'

import { useCompanyFormSubmit } from './hooks'

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
    },
  })

  const { handleSubmit, isSubmiting } = useCompanyFormSubmit({
    company,
    isEditing,
    onClose,
  })

  return (
    <Form {...companyCreateForm}>
      <form className="flex flex-col gap-3" onSubmit={companyCreateForm.handleSubmit(handleSubmit)}>
        <FormField
          control={companyCreateForm.control}
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
          <DialogSubmitButton
            isUpdating={isEditing}
            isLoading={isSubmiting}
            subject="construtora"
          />
        </DialogFooter>
      </form>
    </Form>
  )
}
