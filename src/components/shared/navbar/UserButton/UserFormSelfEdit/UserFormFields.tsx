/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseFormReturn } from 'react-hook-form'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

type UserFormFieldsProps = {
  form: UseFormReturn<
    {
      firstName: string
      email: string
      image: File
      lastName?: string | undefined
      password: string
      confirmPassword: string
    },
    any,
    undefined
  >
}

export default function UserFormFields({ form }: UserFormFieldsProps) {
  return (
    <>
      <div className="flex gap-2">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="w-full space-y-0.5">
              <FormControl>
                <Input placeholder="Primeiro nome" autoFocus {...field} />
              </FormControl>
              <FormMessage className="font-light text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="w-full space-y-0.5">
              <FormControl>
                <Input placeholder="Último nome" {...field} />
              </FormControl>
              <FormMessage className="font-light text-red-500" />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="w-full space-y-0.5">
            <FormControl>
              <Input placeholder="Email" {...field} />
            </FormControl>
            <FormMessage className="font-light text-red-500" />
          </FormItem>
        )}
      />
      <Accordion
        type="single"
        collapsible
        className="w-full overflow-hidden rounded-md border border-input"
      >
        <AccordionItem
          value="edit-password"
          className="border-none px-2 data-[state='open']:bg-accent"
        >
          <AccordionTrigger className="py-2 text-primary/75">
            Editar senha?
          </AccordionTrigger>
          <AccordionContent className="p-[1px] pb-0">
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full space-y-0.5">
                    <FormControl>
                      <Input
                        className="bg-white"
                        type="password"
                        placeholder="Nova senha"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="font-light text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="w-full space-y-0.5">
                    <FormControl>
                      <Input
                        className="bg-white"
                        type="password"
                        placeholder="Confirmar nova senha"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="font-light text-red-500" />
                  </FormItem>
                )}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}
