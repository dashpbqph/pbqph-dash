import Logo from '@/components/logo'

import AuthButton from './auth/auth-button'
import NavigationTab from './navigation-tab'

export default function Navbar() {
  return (
    <div className="flex items-center justify-between">
      <Logo color="color" variant="horizontal" />
      <div className="flex h-[72px] flex-col items-end justify-between">
        <AuthButton />
        <div className="flex flex-col items-end space-x-4 sm:flex-row">
          <NavigationTab href="/">Visão Geral</NavigationTab>
          <NavigationTab href="/indicador">Detalhes do Indicador</NavigationTab>
        </div>
      </div>
    </div>
  )
}
