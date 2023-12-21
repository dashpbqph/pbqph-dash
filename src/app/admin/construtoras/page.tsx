import { Building } from 'lucide-react'

export default function AdminIndicator() {
  return (
    <>
      <div className="item flex items-center gap-4">
        <Building className="h-6 w-6" />
        <span className="text-2xl font-semibold">
          Administração de Construtoras
        </span>
      </div>
    </>
  )
}
