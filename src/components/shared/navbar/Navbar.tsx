import { AuthButton } from '@/components/shared/auth'
import { Logo, Tabs } from '@/components/shared/navbar'

export default function Navbar() {
  return (
    <div className="flex items-center justify-between">
      <Logo />
      <div className="flex flex-col items-end space-y-2">
        {/* Top navigation */}
        <AuthButton />
        {/* Bottom navigation */}
        <Tabs />
      </div>
    </div>
  )
}
