'use client'

import { RouterOutputs } from '@/trpc/shared'
import { UserCog } from 'lucide-react'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

type UserSelfEditProps = {
  user: Awaited<RouterOutputs['user']['getUserByUsername']>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function UserSelfEditButton({ user }: UserSelfEditProps) {
  // const [open, setOpen] = useState(false)

  return (
    // <Dialog open={open} onOpenChange={setOpen}>
    //   <DialogTrigger asChild>
    <DropdownMenuItem
      className="flex space-x-4 py-4 text-gray-400 transition-all hover:pl-3"
      onSelect={(e) => e.preventDefault()}
    >
      <button>
        <UserCog className="h-5 w-5" />
        <span>Editar Conta</span>
      </button>
    </DropdownMenuItem>
    //   </DialogTrigger>
    //   <DialogContent className="max-w-[360px] p-7 md:max-w-[460px]">
    //     <UserSelfEditForm user={user} onSubmit={() => setOpen(false)} />
    //   </DialogContent>
    // </Dialog>
  )
}
