import { Building } from 'lucide-react'

import { CompaniesTable } from '@/components/admin/companies'

export default function AdminIndicator() {
  return (
    <>
      <div className="item flex items-start gap-4">
        <Building className="h-6 w-6" />
        <span className="text-2xl font-semibold leading-none">
          Administração de Construtoras
        </span>
      </div>
      <CompaniesTable />
    </>
  )
}
