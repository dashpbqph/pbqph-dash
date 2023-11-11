import Image from 'next/image'
import Link from 'next/link'

export default function Logo() {
  return (
    <Link
      href="/"
      className="relative block h-[90px] w-[90px] shrink-0 sm:h-[70px] sm:w-[280px]"
    >
      <Image
        src="/logo.svg"
        placeholder="blur"
        blurDataURL="/logo.svg"
        alt="Logo"
        fill
        style={{ objectFit: 'contain' }}
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
        className="hidden sm:block"
      />
      <Image
        src="/logo-icon-only.svg"
        placeholder="blur"
        blurDataURL="/logo.svg"
        alt="Logo"
        fill
        style={{ objectFit: 'contain' }}
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
        className="sm:hidden"
      />
    </Link>
  )
}
