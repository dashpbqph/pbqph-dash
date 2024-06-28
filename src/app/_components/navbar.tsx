import { UserRole } from '@prisma/client'

import Logo from '@/components/logo'

import getAuthData from '../_utils/auth'
import AuthButton from './auth/auth-button'
import { CompanySelect } from './company-select'
import NavigationLinks from './navigation-links'

const COMPANY_SELECT_ALLOWED_ROLES: Array<Omit<'MEMBER', UserRole>> = [
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.STAFF,
]

export default async function Navbar() {
  const { user } = await getAuthData()

  return (
    <div className="flex items-center justify-between">
      <Logo color="color" variant="horizontal" />
      <div className="flex h-[72px] flex-col items-end justify-between">
        <div className="flex items-center gap-3">
          {user?.role && COMPANY_SELECT_ALLOWED_ROLES.includes(user.role) && <CompanySelect />}
          <AuthButton />
        </div>
        <NavigationLinks />
      </div>
    </div>
  )
}
