import { BrickWall } from 'lucide-react'

import { ProjectsTable } from '@/components/admin/projects'

export default function AdminIndicator() {
  return (
    <>
      <div className="item flex items-start gap-4">
        <BrickWall className="h-6 w-6" />
        <span className="text-2xl font-semibold leading-none">
          Administração de Obras
        </span>
      </div>
      <ProjectsTable />
    </>
  )
}
