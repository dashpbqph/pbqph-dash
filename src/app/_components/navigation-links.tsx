'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/', label: 'Visão Geral' },
  { href: '/indicador', label: 'Detalhes do Indicador' },
]

export default function NavigationLinks() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col items-end space-x-4 sm:flex-row">
      {NAV_LINKS.map(({ href, label }) => (
        <NavigationLink
          key={href}
          href={href}
          isActive={pathname === href || (href !== '/' && pathname.includes('/indicador'))}
        >
          {label}
        </NavigationLink>
      ))}
    </div>
  )
}

type NavigationLinkProps = {
  href: string
  isActive: boolean
  children: React.ReactNode
}

function NavigationLink({ href, isActive, children }: NavigationLinkProps) {
  const isBlocked = href.includes('/indicador') && !isActive

  return (
    <Link
      className="data-[blocked=false]:text-animation-underline text-right font-extralight text-secondary data-[blocked=true]:cursor-not-allowed data-[active=true]:font-normal"
      data-active={isActive}
      data-blocked={isBlocked}
      href={isBlocked ? '#' : href}
    >
      {children}
    </Link>
  )
}
