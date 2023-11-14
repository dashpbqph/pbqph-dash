'use client'

import Image from 'next/image'

export default function UserAvatar({
  avatar,
  name,
}: {
  avatar: string | null
  name: string
}) {
  return (
    <div className="relative flex h-11 w-11 overflow-hidden rounded-full">
      {avatar ? (
        <Image
          src={avatar}
          alt="imagem do usuário"
          placeholder="blur"
          blurDataURL={avatar}
          fill
          style={{ objectFit: 'contain' }}
          sizes="(max-width: 768px) 20vw, 10vw"
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
