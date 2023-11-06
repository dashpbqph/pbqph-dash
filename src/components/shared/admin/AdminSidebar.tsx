'use client'

import Link from 'next/link'
import { BarChartBig, Settings, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function AdminSidebar() {
  return (
    <div className="flex h-16 gap-2 rounded-md bg-secondary p-2 sm:h-auto sm:w-16 sm:flex-col">
      <div className="hidden w-full items-center justify-center p-2 text-primary sm:flex">
        <Settings className="h-7 w-7" />
      </div>
      <Separator className="hidden sm:block" />
      {/* Users */}
      <Button
        className="flex h-auto w-full items-center justify-center rounded-md p-2 shadow-md hover:bg-primary/20"
        variant="secondary"
        asChild
      >
        <Link href="/admin/usuarios">
          <Users className="h-6 w-6" />
        </Link>
      </Button>
      {/* Indicators */}
      <Button
        className="flex h-auto w-full items-center justify-center rounded-md p-2 shadow-md hover:bg-primary/20"
        variant="secondary"
        asChild
      >
        <Link href="/admin/indicadores">
          <BarChartBig className="h-6 w-6" />
        </Link>
      </Button>
    </div>
  )
}
