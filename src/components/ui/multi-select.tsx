/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react'
import { Check, ChevronsUpDownIcon, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export type OptionType = Record<'value' | 'label', string>

interface MultiSelectProps {
  options: Record<'value' | 'label', string>[]
  selected: Record<'value' | 'label', string>[]
  onChange: React.Dispatch<React.SetStateAction<Record<'value' | 'label', string>[]>>
  className?: string
  placeholder?: string
}

const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  ({ options, selected, onChange, className, ...props }, ref) => {
    const [open, setOpen] = React.useState(false)
    const [triggerWidth, setTriggerWidth] = React.useState<number>()

    const handleUnselect = (item: Record<'value' | 'label', string>) => {
      onChange(selected.filter((i) => i.value !== item.value))
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className={cn('w-full', className)}>
          <Button
            ref={(node) => {
              if (node) setTriggerWidth(node.offsetWidth)
            }}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            data-empty={selected.length === 0}
            className="group justify-between px-3 data-[empty=true]:h-9"
            onClick={() => setOpen(!open)}
          >
            <div className="flex flex-wrap items-center gap-1">
              {selected.map((item) => (
                <Badge
                  variant="outline"
                  key={item.value}
                  className="flex items-center gap-2 font-normal group-hover:bg-background"
                >
                  {item.label}
                  {open && (
                    <Button
                      asChild
                      variant="outline"
                      size="icon"
                      data-open={open}
                      className="flex h-4 w-full items-center justify-between rounded-md border border-input bg-transparent p-[1px] text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUnselect(item)
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleUnselect(item)
                      }}
                    >
                      <X className="h-2 w-2 text-muted-foreground hover:text-foreground" />
                    </Button>
                  )}
                </Badge>
              ))}
              {selected.length === 0 && (
                <span className="text-sm">{props.placeholder ?? 'Select ...'}</span>
              )}
            </div>
            <ChevronsUpDownIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="flex flex-col gap-1 rounded-md p-1.5"
          style={{ width: triggerWidth || undefined }}
          align="start"
        >
          {options.map((option) => (
            <div
              className="group flex w-full cursor-pointer items-center rounded-md px-2 py-1 text-sm hover:bg-accent data-[selected=true]:bg-primary data-[selected=true]:text-white"
              key={option.value}
              onClick={() => {
                onChange(
                  selected.some((item) => item.value === option.value)
                    ? selected.filter((item) => item.value !== option.value)
                    : [...selected, option],
                )
                setOpen(true)
              }}
              data-selected={selected.some((item) => item.value === option.value)}
            >
              <Check className="mr-2 h-4 w-4 opacity-0 group-data-[selected=true]:opacity-100" />
              {option.label}
            </div>
          ))}
        </PopoverContent>
      </Popover>
    )
  },
)

MultiSelect.displayName = 'MultiSelect'

export { MultiSelect }
