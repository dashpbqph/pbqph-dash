import { UserRole } from '@prisma/client'

export function isAdmin(role: UserRole) {
  return role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN
}
