import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type UserAvatarProps = {
  avatar: string | null
  name: string
  className?: string
}

export default function UserAvatar({ avatar, name, className }: UserAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarImage src={avatar || undefined} alt="imagem do usuário" />
      <AvatarFallback>
        {name
          ?.split(' ')
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}
