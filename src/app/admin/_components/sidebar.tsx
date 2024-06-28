'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { RouterOutputs } from '@/trpc/react'
import {
  BarChartBig,
  Box,
  BrickWall,
  Building,
  Compass,
  FileCog,
  LucideIcon,
  Microscope,
  PieChart,
  SearchCheck,
  SendToBack,
  Shield,
  Users,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { mapUserRoleToLabel } from '@/utils/auth'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import GeomIcon from '@/components/geom-icon'
import Logo from '@/components/logo'
import UserAvatar from '@/components/user-avatar'
import LogoutButton from '@/app/_components/auth/logout-button'

type AdminSidebarProps = {
  user: Awaited<RouterOutputs['user']['getUserByUsername']>
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  return (
    <div className="flex h-16 items-center gap-9 rounded-md bg-secondary p-2 py-5 sm:h-auto sm:w-52 sm:flex-col">
      <Logo variant="vertical" color="white" />
      <div className="flex w-full flex-1 flex-col gap-1.5">
        <AdminSidebarItem
          href="/admin/usuarios"
          icon={Users}
          active={pathname === '/admin/usuarios'}
        >
          Usuários
        </AdminSidebarItem>
        <AdminSidebarItem
          href="/admin/indicadores"
          icon={PieChart}
          active={pathname === '/admin/indicadores'}
        >
          Indicadores
        </AdminSidebarItem>
        <Accordion className="flex flex-col gap-1.5" type="single" collapsible>
          <AccordionItem value="siac">
            <AccordionTrigger
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'flex h-auto w-full items-center justify-between gap-2 rounded-md border-none bg-transparent px-3 py-2 text-sm text-white hover:bg-white/10',
              )}
            >
              SiAC
              <GeomIcon className="h-[10px] w-[10px] shrink-0 text-primary transition-all duration-200" />
            </AccordionTrigger>
            <AccordionContent className="pl-2">
              <AdminSidebarList>
                <AdminSidebarItem
                  className="rounded-l-none"
                  href="/admin/oacs"
                  icon={Box}
                  active={pathname === '/admin/oacs'}
                >
                  OACs
                </AdminSidebarItem>
                <AdminSidebarItem
                  className="rounded-l-none"
                  href="/admin/construtoras"
                  icon={Building}
                  active={pathname === '/admin/construtoras'}
                >
                  Construtoras
                </AdminSidebarItem>
                <AdminSidebarItem
                  className="rounded-l-none"
                  href="/admin/obras"
                  icon={BrickWall}
                  active={pathname === '/admin/obras'}
                >
                  Obras
                </AdminSidebarItem>
              </AdminSidebarList>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="simac">
            <AccordionTrigger
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'flex h-auto w-full items-center justify-between gap-2 rounded-md border-none bg-transparent px-3 py-2 text-sm text-white hover:bg-white/10',
              )}
            >
              SiMaC
              <GeomIcon className="h-[10px] w-[10px] shrink-0 text-primary transition-all duration-200" />
            </AccordionTrigger>
            <AccordionContent className="pl-2">
              <AdminSidebarList>
                <AdminSidebarItem
                  className="rounded-l-none"
                  href="/admin/egts"
                  icon={SendToBack}
                  active={pathname === '/admin/egts'}
                >
                  EGTs
                </AdminSidebarItem>
                <AdminSidebarItem
                  className="rounded-l-none"
                  href="/admin/ems"
                  icon={Shield}
                  active={pathname === '/admin/ems'}
                >
                  EMs
                </AdminSidebarItem>
                <AdminSidebarItem
                  className="rounded-l-none"
                  href="/admin/psqs"
                  icon={SearchCheck}
                  active={pathname === '/admin/psqs'}
                >
                  PSQs
                </AdminSidebarItem>
              </AdminSidebarList>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="sinat">
            <AccordionTrigger
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'flex h-auto w-full items-center justify-between gap-2 rounded-md border-none bg-transparent px-3 py-2 text-sm text-white hover:bg-white/10',
              )}
            >
              SiNAT
              <GeomIcon className="h-[10px] w-[10px] shrink-0 text-primary transition-all duration-200" />
            </AccordionTrigger>
            <AccordionContent className="pl-2">
              <AdminSidebarList>
                <AdminSidebarItem
                  className="rounded-l-none"
                  href="/admin/itas"
                  icon={Microscope}
                  active={pathname === '/admin/itas'}
                >
                  ITAs
                </AdminSidebarItem>
                <AdminSidebarItem
                  className="rounded-l-none"
                  href="/admin/fads"
                  icon={BarChartBig}
                  active={pathname === '/admin/fads'}
                >
                  FADs
                </AdminSidebarItem>
                <AdminSidebarItem
                  className="rounded-l-none"
                  href="/admin/diretrizes"
                  icon={Compass}
                  active={pathname === '/admin/diretrizes'}
                >
                  Diretrizes
                </AdminSidebarItem>
                <AdminSidebarItem
                  className="rounded-l-none"
                  href="/admin/datecs"
                  icon={FileCog}
                  active={pathname === '/admin/datecs'}
                >
                  DATECs
                </AdminSidebarItem>
              </AdminSidebarList>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex h-9 w-full justify-between overflow-hidden rounded-md bg-transparent p-0 pr-2 hover:bg-white/10">
            <div className="flex h-full flex-1 items-center justify-start gap-2 py-0">
              <div className="flex h-full overflow-hidden rounded-sm">
                <div className="w-[9px] bg-accent" />
                <UserAvatar
                  avatar={user.avatar}
                  name={user.name}
                  className="h-9 w-9 rounded-none"
                />
              </div>
              <div className="flex flex-col justify-center gap-0.5 text-left">
                <span className="font-semibold">{user.name}</span>
                <span className="text-xxs font-extralight text-accent">
                  {mapUserRoleToLabel(user.role)}
                </span>
              </div>
            </div>
            <GeomIcon className="h-[10px] w-[10px] rotate-180 text-primary" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={8} className="flex w-[192px] rounded-md p-1 shadow-xl">
          <LogoutButton />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function AdminSidebarList({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-1.5 border-l-[1px] border-accent py-1">{children}</div>
}

type AdminSidebarItemProps = {
  href: string
  icon: LucideIcon
  className?: string
  active?: boolean
  children: React.ReactNode
}

function AdminSidebarItem({
  href,
  icon: Icon,
  className,
  active,
  children,
}: AdminSidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: 'outline' }),
        'flex h-auto w-full items-center justify-start gap-2 rounded-md border-none bg-transparent px-3 py-2 text-sm text-white hover:bg-white/10 data-[active=true]:bg-primary data-[active=false]:shadow-none',
        className,
      )}
      data-active={active}
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  )
}
