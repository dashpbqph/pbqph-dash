import Link from 'next/link'
import { ChevronDownIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type AdminPageHeaderProps = {
  title: string
}

export default function AdminPageHeader({ title }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-xs outline-none">
                Administração
                <ChevronDownIcon className="h-[14px] w-[14px]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="flex flex-col gap-0.5">
                <DropdownMenuItem
                  className={cn('text-xs', title === 'Usuários' && 'bg-primary text-white')}
                  asChild
                >
                  <Link className="w-full" href="/admin/usuarios">
                    Usuários
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={cn('text-xs', title === 'Indicadores' && 'bg-primary text-white')}
                >
                  <Link className="w-full" href="/admin/indicadores">
                    Indicadores
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={cn('text-xs', title === 'Construtoras' && 'bg-primary text-white')}
                >
                  <Link className="w-full" href="/admin/construtoras">
                    Construtoras
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={cn('text-xs', title === 'Obras' && 'bg-primary text-white')}
                >
                  <Link className="w-full" href="/admin/obras">
                    Obras
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={cn('text-xs', title === 'Entidades' && 'bg-primary text-white')}
                >
                  <Link className="w-full" href="/admin/entidades">
                    Entidades
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <span className="text-2xl font-bold leading-none text-secondary">
        Administração de {title}
      </span>
    </div>
  )
}
