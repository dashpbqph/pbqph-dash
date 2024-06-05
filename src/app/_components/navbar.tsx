import Logo from '@/components/logo'

import AuthButton from './auth/auth-button'
import NavigationLinks from './navigation-links'

export default function Navbar() {
  return (
    <div className="flex items-center justify-between">
      <Logo color="color" variant="horizontal" />
      <div className="flex h-[72px] flex-col items-end justify-between">
        <AuthButton />
        <NavigationLinks />
      </div>
    </div>
  )
}
