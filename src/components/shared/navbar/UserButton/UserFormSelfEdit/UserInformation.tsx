/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { UserRole } from '@prisma/client'

import { mapUserRoleToLabel } from '@/utils/auth'

type UserInformationProps = {
  username: string
  role?: UserRole
}

export default function UserInformation({
  username,
  role,
}: UserInformationProps) {
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-1">
      <div className="font-semibold">{username}</div>
      <div className="text-sm font-normal">{mapUserRoleToLabel(role!)}</div>
    </div>
  )
}
