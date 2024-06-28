'use client'

import { useEffect, useState } from 'react'
import { api } from '@/trpc/react'
import { useAtom } from 'jotai'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { selectedCompanyAtom } from '@/app/_atoms/company'

export function CompanySelect() {
  const { data: companies, isPending } = api.company.getAll.useQuery()
  const [open, setOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useAtom(selectedCompanyAtom)

  useEffect(() => {
    // verify if selected company still exists
    if (selectedCompany && companies) {
      const companyExists = companies.some((company) => company.id === selectedCompany)
      if (!companyExists) {
        setSelectedCompany(null)
      }
    }
  }, [companies, selectedCompany, setSelectedCompany])

  const handleSelectCompany = (companyId: string) => {
    const newValue = companyId === selectedCompany ? null : companyId
    setSelectedCompany(newValue)
    setOpen(false)
  }

  return !isPending ? (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="group h-8 w-fit max-w-[420px] justify-between bg-white"
        >
          {selectedCompany ? (
            <span className="truncate font-light">
              Construtora:{' '}
              <span className="font-medium text-primary">
                {companies?.find((company) => company.id === selectedCompany)?.name}
              </span>
            </span>
          ) : (
            'Visualizar por Construtora?'
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit max-w-[420px] p-0" align="end">
        <Command>
          <CommandInput placeholder="Buscar construtora..." />
          <CommandList>
            <CommandEmpty>Construtora não encontrada</CommandEmpty>
            <CommandGroup>
              {companies?.map((company) => (
                <CommandItem
                  key={company.id}
                  value={company.id}
                  onSelect={() => handleSelectCompany(company.id)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedCompany === company.id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {company.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  ) : (
    <div className="h-8 w-[280px] animate-pulse rounded-md bg-gray-300 text-sm" />
  )
}
