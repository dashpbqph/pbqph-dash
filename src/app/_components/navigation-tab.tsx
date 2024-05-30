'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavigationTab({
  href,
  children,
}: React.PropsWithChildren<{ href: string }>) {
  const pathname = usePathname()
  const isActive = pathname === href ? true : href !== '/' && pathname.includes('/indicador')
  const isBlocked = href.includes('/indicador') && pathname === '/'

  return (
    <Link
      className="data-[blocked=false]:text-animation-underline text-right font-extralight text-secondary data-[blocked=true]:cursor-not-allowed data-[active=true]:font-normal"
      data-active={isActive}
      data-blocked={isBlocked}
      href={href !== '/' ? '#' : href}
    >
      {children}
    </Link>
  )
}
