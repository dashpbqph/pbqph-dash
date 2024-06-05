import { Category } from '@prisma/client'

export const SYSTEM_OPTIONS = [
  {
    value: 'SiAC',
    label: 'SiAC',
  },
  {
    value: 'SiMaC',
    label: 'SiMaC',
  },
  {
    value: 'SiNAT',
    label: 'SiNAT',
  },
]

export const CATEGORY_OPTIONS = [
  {
    value: Category.ESTRATEGICO,
    label: 'Estratégico',
  },
  {
    value: Category.DESEMPENHO,
    label: 'Desempenho',
  },
  {
    value: Category.RESULTADO,
    label: 'Resultado',
  },
]
