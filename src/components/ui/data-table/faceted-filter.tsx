import * as React from 'react'
import { startTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Column } from '@tanstack/react-table'
import { CheckIcon, CirclePlusIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
  queryParam?: string
  className?: string
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  queryParam,
  className,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues()

  const searchParams = useSearchParams()
  const selectedOptions = searchParams.get(queryParam ?? '')?.split(',')
  const selectedValues = new Set(selectedOptions ?? [])
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" className={cn('h-8 border-dashed', className)} icon={CirclePlusIcon}>
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge className="rounded-sm px-1 font-normal lg:hidden">{selectedValues.size}</Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge className="rounded-sm px-1 font-normal">
                    {selectedValues.size} selecionados
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge key={option.value} className="rounded-sm px-1 font-normal">
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit min-w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>Nenhum resultado encontrado</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value)
                const isDisabled = !facets?.get(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isDisabled) return
                      const params = new URLSearchParams(window.location.search)
                      if (isSelected) {
                        if (queryParam) {
                          if (selectedValues.size === 1) {
                            params.delete(queryParam)
                          } else {
                            params.set(
                              queryParam,
                              [...selectedValues]
                                .filter((value) => value !== option.value)
                                .join(','),
                            )
                          }
                        }
                      } else {
                        if (queryParam) {
                          params.set(queryParam, [...selectedValues, option.value].join(','))
                        }
                      }

                      startTransition(() => {
                        router.replace(`${pathname}?${params.toString()}`)
                      })

                      const filterValues = Array.from(selectedValues)
                      column?.setFilterValue(filterValues.length ? filterValues : undefined)
                    }}
                    disabled={isDisabled}
                    className="group"
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible',
                      )}
                    >
                      <CheckIcon className={cn('h-4 w-4')} />
                    </div>
                    {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      const params = new URLSearchParams(window.location.search)
                      if (queryParam) {
                        params.delete(queryParam)
                      }

                      startTransition(() => {
                        router.replace(`${pathname}?${params.toString()}`)
                      })

                      column?.setFilterValue(undefined)
                    }}
                    className="justify-center text-center"
                  >
                    Limpar filtros
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
