import Navbar from '@/app/_components/navbar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-1 flex-col gap-y-3">
      <Navbar />
      {children}
    </div>
  )
}
