import { atomWithStorage } from 'jotai/utils'

export const selectedCompanyAtom = atomWithStorage<string | null | undefined>(
  'selectedCompany',
  undefined,
)
