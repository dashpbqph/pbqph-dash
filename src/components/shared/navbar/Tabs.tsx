'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Tabs() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col items-end space-x-4 sm:flex-row">
      <Link
        className="text-animation-underline text-right data-[active=true]:font-semibold data-[active=true]:text-[#FFAE1B] data-[active=true]:before:bg-[#FFAE1B]"
        data-active={pathname === '/'}
        href="/"
      >
        Visão Geral
      </Link>
      <Link
        className="text-animation-underline text-right data-[active=true]:font-semibold data-[active=true]:text-[#FFAE1B] data-[active=true]:before:bg-[#FFAE1B]"
        data-active={pathname === '/detalhes'}
        href="/detalhes"
      >
        Detalhes do Indicador
      </Link>
    </div>
  )
}
