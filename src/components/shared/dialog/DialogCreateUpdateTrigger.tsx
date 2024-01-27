import { LucideIcon, Plus } from 'lucide-react'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { DialogTrigger } from '@/components/ui/dialog'

type DialogCreateUpdateTriggerProps = {
  isEditing: boolean
  icon: LucideIcon
  subject: string
}

export default function DialogCreateUpdateTrigger({
  isEditing,
  subject,
  icon: Icon,
}: DialogCreateUpdateTriggerProps) {
  return (
    <DialogTrigger
      className={cn(
        !isEditing && buttonVariants({ variant: 'outline' }),
        'group',
      )}
      data-editing={isEditing}
    >
      <div className="relative">
        <Icon className="block h-5 w-5 group-data-[editing=true]:hidden group-data-[editing=false]:sm:hidden" />
        <Plus
          className="absolute -right-[3px] top-[11px] h-[14px] w-[14px] rounded-full text-white group-data-[editing=true]:hidden group-data-[editing=false]:sm:hidden"
          strokeWidth={6}
        />
        <Plus className="absolute -right-[2px] top-[12px] h-[12px] w-[12px] rounded-full group-data-[editing=true]:hidden group-data-[editing=false]:sm:hidden" />
      </div>
      <span className="group-data-[editing=true]:block group-data-[editing=false]:hidden group-data-[editing=false]:sm:block">
        {isEditing ? 'Editar' : 'Criar'} {subject}
      </span>
    </DialogTrigger>
  )
}
