'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type ComboboxProps = {
  className?: string
  contentList: { value: string; label: string }[]
  defaultValue?: string
  placeholderValue?: string
  placeholderSearch?: string
  placeholderEmpty?: string | React.ReactNode
  onChange: (value: string) => void
}

export function Combobox({
  className,
  contentList,
  placeholderValue,
  placeholderSearch,
  placeholderEmpty,
  defaultValue,
  onChange,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(defaultValue)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('justify-between px-6', className)}
        >
          {value
            ? contentList.find(
                (content) => content.value.toLowerCase() === value,
              )?.label
            : placeholderValue}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder={placeholderSearch} />
          <CommandEmpty>{placeholderEmpty}</CommandEmpty>
          <CommandGroup>
            {contentList.map((content) => (
              <CommandItem
                key={content.value}
                value={content.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? '' : currentValue)
                  const selected = contentList.find(
                    (c) => c.value.toLowerCase() === currentValue,
                  )
                  if (selected) onChange(selected.value)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === content.value ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {content.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
