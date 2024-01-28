'use client'

import { projectCreateFormSchema } from '@/schemas/project'
import { api } from '@/trpc/react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { ProjectWithRelations } from '@/types/project'
import { useProjectFormSubmit } from './ProjectCreateUpdateForm.hooks'

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
      description: project?.description || '',
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
      <form
        className="flex flex-col gap-3"
        onSubmit={projectCreateForm.handleSubmit(handleSubmit)}
      >
        <FormField
          control={projectCreateForm.control}
          name="company"
          render={({ field }) => (
            <FormItem className="grid w-full items-center space-y-0.5">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Construtora*" />
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
          )}
        />
        <FormField
          control={projectCreateForm.control}
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
          control={projectCreateForm.control}
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
          <DialogButtonSubmit isLoading={isSubmiting} subject="obra" />
        </DialogFooter>
      </form>
    </Form>
  )
}
