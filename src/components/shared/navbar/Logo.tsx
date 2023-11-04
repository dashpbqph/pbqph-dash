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
        alt="Logo"
        fill
        style={{ objectFit: 'contain' }}
        className="hidden sm:block"
        priority
      />
      <Image
        src="/logo-icon-only.svg"
        alt="Logo"
        fill
        style={{ objectFit: 'contain' }}
        className="sm:hidden"
        priority
      />
    </Link>
  )
}
