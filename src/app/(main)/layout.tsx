import { IndicatorFilters } from '@/components/shared/indicator'

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
