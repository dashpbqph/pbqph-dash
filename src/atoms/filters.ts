import { atom } from 'jotai'

type Filters = {
  system: string | null
  category: string | null
  indicator: string | null
}

export const filtersAtom = atom<Filters>({
  system: null,
  category: null,
  indicator: null,
})
