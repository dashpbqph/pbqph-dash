import Logo from '@/components/logo'
import { AuthButton } from './auth'
import Tabs from './tabs'

export default function Navbar() {
  return (
    <div className="flex items-center justify-between">
      <Logo />
      <div className="flex flex-col items-end space-y-2">
        <AuthButton />
        <Tabs />
      </div>
    </div>
  )
}
