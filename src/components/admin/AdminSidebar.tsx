'use client'

import Link from 'next/link'
import {
  Box,
  BrickWall,
  Building,
  LucideIcon,
  PieChart,
  Settings,
  Users,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function AdminSidebar() {
  return (
    <div className="flex h-16 gap-2 rounded-md bg-secondary p-2 sm:h-auto sm:w-16 sm:flex-col">
      <div className="hidden w-full items-center justify-center p-2 text-primary sm:flex">
        <Settings className="h-7 w-7" />
      </div>
      <Separator className="hidden sm:block" />
      <AdminSidebarItem href="/admin/usuarios" icon={Users} />
      <AdminSidebarItem href="/admin/indicadores" icon={PieChart} />
      <AdminSidebarItem href="/admin/construtoras" icon={Building} />
      <AdminSidebarItem href="/admin/obras" icon={BrickWall} />
      <AdminSidebarItem href="/admin/oacs" icon={Box} />
    </div>
  )
}

type AdminSidebarItemProps = {
  href: string
  icon: LucideIcon
}

function AdminSidebarItem({ href, icon: Icon }: AdminSidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: 'outline' }),
        'flex h-auto w-full items-center justify-center rounded-md p-2 hover:bg-primary/20',
      )}
    >
      <Icon className="h-6 w-6" />
    </Link>
  )
}
