import * as React from 'react'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { Check, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
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

export type OptionType = Record<'value' | 'label', string>

interface MultiSelectProps {
  options: Record<'value' | 'label', string>[]
  selected: Record<'value' | 'label', string>[]
  onChange: React.Dispatch<
    React.SetStateAction<Record<'value' | 'label', string>[]>
  >
  className?: string
  placeholder?: string
}

const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  ({ options, selected, onChange, className, ...props }, ref) => {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState<string>('')

    const handleUnselect = (item: Record<'value' | 'label', string>) => {
      onChange(selected.filter((i) => i.value !== item.value))
    }

    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Backspace' && query === '' && selected.length > 0) {
          onChange(selected.filter((_, index) => index !== selected.length - 1))
        }

        if (e.key === 'Escape') {
          setOpen(false)
        }
      }

      document.addEventListener('keydown', handleKeyDown)

      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }, [onChange, query, selected])

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className={className}>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            data-empty={selected.length === 0}
            className="group w-full justify-between px-3 data-[empty=true]:h-9"
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
                <span className="text-sm text-muted-foreground">
                  {props.placeholder ?? 'Select ...'}
                </span>
              )}
            </div>
            <CaretSortIcon className="h-4 w-4 opacity-25" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command className={className}>
            <CommandInput
              onValueChange={(item) => {
                setQuery(item)
              }}
              placeholder="Buscar..."
            />
            <CommandEmpty>Nenhum resultado</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onChange(
                      selected.some((item) => item.value === option.value)
                        ? selected.filter((item) => item.value !== option.value)
                        : [...selected, option],
                    )
                    setOpen(true)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selected.some((item) => item.value === option.value)
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    )
  },
)

MultiSelect.displayName = 'MultiSelect'

export { MultiSelect }
