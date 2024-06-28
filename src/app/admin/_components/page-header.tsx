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
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger
                    className={cn(
                      'text-xs',
                      ['OACs', 'Construtoras', 'Obras'].includes(title) &&
                        'bg-primary text-white hover:text-black data-[state=open]:text-black',
                    )}
                  >
                    SiAC
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="flex flex-col gap-0.5" sideOffset={8}>
                      <DropdownMenuItem
                        className={cn('text-xs', title === 'OACs' && 'bg-primary text-white')}
                      >
                        <Link className="w-full" href="/admin/oacs">
                          OACs
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={cn(
                          'text-xs',
                          title === 'Construtoras' && 'bg-primary text-white',
                        )}
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
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger
                    className={cn(
                      'text-xs',
                      ['EGTs', 'EMs', 'PSQs'].includes(title) &&
                        'bg-primary text-white hover:text-black data-[state=open]:text-black',
                    )}
                  >
                    SiMaC
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="flex flex-col gap-0.5" sideOffset={8}>
                      <DropdownMenuItem
                        className={cn('text-xs', title === 'EGTs' && 'bg-primary text-white')}
                      >
                        <Link className="w-full" href="/admin/egts">
                          EGTs
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={cn('text-xs', title === 'EMs' && 'bg-primary text-white')}
                      >
                        <Link className="w-full" href="/admin/ems">
                          EMs
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={cn('text-xs', title === 'PSQs' && 'bg-primary text-white')}
                      >
                        <Link className="w-full" href="/admin/psqs">
                          PSQs
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger
                    className={cn(
                      'text-xs',
                      ['ITAs', 'FADs', 'Diretrizes', 'DATECs'].includes(title) &&
                        'bg-primary text-white hover:text-black data-[state=open]:text-black',
                    )}
                  >
                    SiNAT
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="flex flex-col gap-0.5" sideOffset={8}>
                      <DropdownMenuItem
                        className={cn('text-xs', title === 'ITAs' && 'bg-primary text-white')}
                      >
                        <Link className="w-full" href="/admin/itas">
                          ITAs
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={cn('text-xs', title === 'FADs' && 'bg-primary text-white')}
                      >
                        <Link className="w-full" href="/admin/fads">
                          FADs
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={cn('text-xs', title === 'Diretrizes' && 'bg-primary text-white')}
                      >
                        <Link className="w-full" href="/admin/diretrizes">
                          Diretrizes
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={cn('text-xs', title === 'DATECs' && 'bg-primary text-white')}
                      >
                        <Link className="w-full" href="/admin/datecs">
                          DATECs
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
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
