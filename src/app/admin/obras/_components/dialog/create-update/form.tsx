'use client'

import { projectCreateFormSchema } from '@/schemas/project'
import { api } from '@/trpc/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import type { ProjectWithRelations } from '@/types/project'
import { DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import DialogSubmitButton from '@/app/admin/_components/dialog-submit-button'
import FormInputLabel from '@/app/admin/_components/form-input-label'

import { useProjectFormSubmit } from './hooks'

type ProjectCreateUpdateFormProps = {
  project?: ProjectWithRelations
  onClose: () => void
}

export default function ProjectCreateUpdateForm({
  project,
  onClose,
}: ProjectCreateUpdateFormProps) {
  const isEditing = !!project
  const { data: companies } = api.company.getAll.useQuery()

  const projectCreateForm = useForm<z.infer<typeof projectCreateFormSchema>>({
    resolver: zodResolver(projectCreateFormSchema),
    defaultValues: {
      name: project?.name || '',
      company: project?.companyId || '',
    },
  })

  const { handleSubmit, isSubmiting } = useProjectFormSubmit({
    isEditing,
    onClose,
    project,
  })

  return (
    <Form {...projectCreateForm}>
      <form className="flex flex-col gap-3" onSubmit={projectCreateForm.handleSubmit(handleSubmit)}>
        <FormField
          control={projectCreateForm.control}
          name="company"
          render={({ field }) => (
            <div className="relative w-full">
              <FormInputLabel label="Construtora" />
              <FormItem className="grid w-full items-center space-y-0.5">
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Nenhuma" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {companies?.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="font-light text-red-500" />
              </FormItem>
            </div>
          )}
        />
        <FormField
          control={projectCreateForm.control}
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
          <DialogSubmitButton isUpdating={isEditing} isLoading={isSubmiting} subject="obra" />
        </DialogFooter>
      </form>
    </Form>
  )
}
