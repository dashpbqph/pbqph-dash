import { UseFormReturn } from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import LoginFormSubmitButton from './LoginFormSubmitButton'

type LoginFormFieldsProps = {
  loginForm: UseFormReturn<{ username: string; password: string }>
  isLoading: boolean
}

export default function LoginFormFields({
  loginForm,
  isLoading,
}: LoginFormFieldsProps) {
  return (
    <div className="space-y-2">
      <FormField
        control={loginForm.control}
        name="username"
        render={({ field }) => (
          <FormItem className="grid w-full items-center gap-2.5">
            <FormLabel>Nome de Usuário</FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input autoFocus {...field} />
              </FormControl>
              <FormMessage className="font-light text-red-500" />
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={loginForm.control}
        name="password"
        render={({ field }) => (
          <FormItem className="grid w-full items-center gap-2.5">
            <FormLabel>Senha</FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage className="font-light text-red-500" />
            </div>
          </FormItem>
        )}
      />
      <LoginFormSubmitButton isLoading={isLoading} />
    </div>
  )
}
