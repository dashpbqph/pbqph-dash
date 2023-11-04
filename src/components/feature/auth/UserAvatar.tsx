import Image from 'next/image'

export default function UserAvatar({
  avatar,
  name,
}: {
  avatar?: string | null
  name?: string | null
}) {
  return (
    <div className="relative flex h-11 w-11 overflow-hidden rounded-full">
      {avatar ? (
        <Image
          src={avatar}
          alt="imagem do usuário"
          style={{ objectFit: 'contain' }}
          fill
          priority
        />
      ) : (
        <span className="flex w-full items-center justify-center">
          {name
            ?.split(' ')
            .map((n) => n[0])
            .join('')}
        </span>
      )}
    </div>
  )
}
