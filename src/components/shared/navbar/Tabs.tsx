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
      <div
        className="data-[active=true]:text-animation-underline text-right data-[active=false]:cursor-not-allowed data-[active=true]:font-semibold data-[active=false]:text-white/60 data-[active=true]:text-[#FFAE1B] data-[active=true]:before:bg-[#FFAE1B]"
        data-active={pathname === '/detalhes'}
      >
        Detalhes do Indicador
      </div>
    </div>
  )
}
