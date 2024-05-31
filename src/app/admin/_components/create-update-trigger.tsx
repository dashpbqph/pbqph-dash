import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { DialogTrigger } from '@/components/ui/dialog'

type DialogCreateUpdateTriggerProps = {
  isEditing: boolean
  subject: string
  className?: string
}

export default function DialogCreateUpdateTrigger({
  isEditing,
  subject,
  className,
}: DialogCreateUpdateTriggerProps) {
  return (
    <DialogTrigger
      className={cn(
        !isEditing && buttonVariants({ variant: 'default' }),
        'group h-8 w-fit overflow-hidden bg-white p-0 text-sm data-[editing=true]:w-full data-[editing=true]:hover:bg-accent',
        className,
      )}
      data-editing={isEditing}
    >
      <span className="flex h-full group-data-[editing=false]:items-center group-data-[editing=false]:bg-primary group-data-[editing=false]:px-3">
        {isEditing ? 'Editar' : 'Criar'} {subject}
      </span>
    </DialogTrigger>
  )
}
