import { Category, Group, SystemAbbrev } from '@prisma/client'

export const SYSTEM_OPTIONS = [
  {
    value: SystemAbbrev.SiAC,
    label: 'SiAC',
  },
  {
    value: SystemAbbrev.SiMaC,
    label: 'SiMaC',
  },
  {
    value: SystemAbbrev.SiNAT,
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

export const GROUP_OPTIONS = [
  {
    value: Group.OBRA,
    label: 'Obra',
  },
  {
    value: Group.EMPRESA,
    label: 'Empresa',
  },
  {
    value: Group.CONJUNTO_EMPRESAS,
    label: 'Conjunto de Empresas',
  },
]
