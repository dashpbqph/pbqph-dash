import { IndicatorFilters } from '@/components/dashboard/filters'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <IndicatorFilters />
      {children}
    </>
  )
}
