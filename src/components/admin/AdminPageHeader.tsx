import { LucideIcon } from 'lucide-react'

type AdminPageHeaderProps = {
  title: string
  icon: LucideIcon
}

export default function AdminPageHeader({
  title,
  icon: Icon,
}: AdminPageHeaderProps) {
  return (
    <div className="item flex items-start gap-4">
      <Icon className="h-6 w-6" />
      <span className="text-2xl font-semibold leading-none">{title}</span>
    </div>
  )
}
