'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAtomValue } from 'jotai'

import { filtersAtom } from '@/atoms/filters'
import { toast } from '@/components/ui/use-toast'

export default function Tabs() {
  const pathname = usePathname()
  const filters = useAtomValue(filtersAtom)

  function handleMissingIndicator() {
    toast({
      title: 'Nenhum indicador selecionado',
      description: 'Selecione um indicador para continuar.',
      status: 'error',
    })
  }

  return (
    <div className="flex flex-col items-end space-x-4 sm:flex-row">
      <Link
        className="text-animation-underline text-right data-[active=true]:font-semibold data-[active=true]:text-[#FFAE1B] data-[active=true]:before:bg-[#FFAE1B]"
        data-active={pathname === '/'}
        href="/"
      >
        Visão Geral
      </Link>
      {!filters.indicator ? (
        <Link
          className="text-animation-underline text-right data-[active=true]:font-semibold data-[active=true]:text-[#FFAE1B] data-[active=true]:before:bg-[#FFAE1B]"
          data-active={pathname === '/detalhes'}
          href="/detalhes"
        >
          Detalhes do Indicador
        </Link>
      ) : (
        <button
          className="text-animation-underline text-right data-[active=true]:font-semibold data-[active=true]:text-[#FFAE1B] data-[active=true]:before:bg-[#FFAE1B]"
          onClick={handleMissingIndicator}
        >
          Detalhes do Indicador
        </button>
      )}
    </div>
  )
}
