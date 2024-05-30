'use client'

import { entityCreateFormSchema } from '@/schemas/entity'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Entity } from '@/types/entity'
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

import { ENTITY_MAP } from '../../constants'
import { useEntityFormSubmit } from './hooks'

type EntityCreateUpdateDialogProps = {
  entity?: Entity
  onClose: () => void
}

export default function EntityCreateUpdateForm({ entity, onClose }: EntityCreateUpdateDialogProps) {
  const isEditing = !!entity

  const entityCreateForm = useForm<z.infer<typeof entityCreateFormSchema>>({
    resolver: zodResolver(entityCreateFormSchema),
    defaultValues: {
      name: entity?.name || '',
      type: entity?.type || '',
    },
  })

  const { handleSubmit, isSubmiting } = useEntityFormSubmit({
    entity,
    isEditing,
    onClose,
  })

  return (
    <Form {...entityCreateForm}>
      <form className="flex flex-col gap-3" onSubmit={entityCreateForm.handleSubmit(handleSubmit)}>
        <FormField
          control={entityCreateForm.control}
          name="type"
          render={({ field }) => (
            <div className="relative w-full">
              <FormInputLabel label="Tipo" />
              <FormItem className="grid w-full items-center space-y-0.5">
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Nenhuma" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(ENTITY_MAP).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
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
          control={entityCreateForm.control}
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
          <DialogSubmitButton isUpdating={isEditing} isLoading={isSubmiting} subject="Entidade" />
        </DialogFooter>
      </form>
    </Form>
  )
}
