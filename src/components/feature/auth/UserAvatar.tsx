import Image from 'next/image'

export default function UserAvatar({
  avatar,
  name,
}: {
  avatar?: string | null
  name?: string | null
}) {
  return (
    <div className="relative h-11 w-11 justify-center overflow-hidden rounded-full">
      {avatar ? (
        <Image
          src={avatar}
          alt="imagem do usuário"
          style={{ objectFit: 'contain' }}
          fill
          priority
        />
      ) : (
        <span>
          {name
            ?.split(' ')
            .map((n) => n[0])
            .join('')}
        </span>
      )}
    </div>
  )
}
