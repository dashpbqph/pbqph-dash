import { UserAvatar } from '@/components/shared/auth'
import { DropdownMenuLabel } from '@/components/ui/dropdown-menu'

type UserButtonHeaderProps = {
  avatar: string | null
  name: string
  username: string
}

export default function UserButtonHeader({
  avatar,
  name,
  username,
}: UserButtonHeaderProps) {
  return (
    <DropdownMenuLabel className="flex space-x-3 px-0">
      <div className="relative h-11 w-11 justify-center overflow-hidden rounded-full border-[1.5px]">
        <UserAvatar avatar={avatar} name={name} />
      </div>
      <div className="flex flex-col justify-center text-left">
        <div className="font-semibold">{name}</div>
        <div className="text-sm font-normal">{username}</div>
      </div>
    </DropdownMenuLabel>
  )
}
