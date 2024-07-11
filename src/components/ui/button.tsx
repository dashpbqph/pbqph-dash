import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:opacity-90',
        outline:
          'border border-input bg-background text-secondary shadow-sm font-normal hover:bg-white',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-background hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  icon?: LucideIcon
  classNameIcon?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, classNameIcon, variant, size, icon: Icon, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return Icon ? (
      <button
        className={cn(
          buttonVariants({ variant, size, className }),
          'min-w-fit overflow-hidden bg-background p-0 text-secondary hover:bg-white',
        )}
        ref={ref}
        {...props}
      >
        <div className="flex h-full items-center bg-primary px-2">
          <Icon className={cn('h-5 w-5 text-background', classNameIcon)} />
        </div>
        <div className="flex h-full flex-1 items-center justify-center px-3 text-secondary">
          {props.children}
        </div>
      </button>
    ) : (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
