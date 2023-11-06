import { ReactNode } from 'react'
import Link from 'next/link'
import { BarChartBig, Settings, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 shrink-0 flex-col gap-3 sm:flex-row">
      {/* Sidebar */}
      <div className="flex h-16 gap-2 rounded-md bg-secondary p-2 sm:h-auto sm:w-16 sm:flex-col">
        <div className="flex w-full items-center justify-center p-2 text-primary">
          <Settings className="h-7 w-7" />
        </div>
        <Separator />
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
      <div className="flex flex-1 flex-col gap-6 rounded-md bg-white p-4 text-primary">
        {children}
      </div>
    </div>
  )
}
