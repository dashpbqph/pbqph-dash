import type { Tab } from '@/types/indicator'

export const steps: Array<{ id: Tab; name: string; fields: string[] }> = [
  {
    id: 'basic',
    name: 'Informações básicas',
    fields: [
      'code',
      'system',
      'category',
      'name',
      'polarity',
      'source',
      'periodicity',
      'impacts',
      'cumulative',
    ],
  },
  {
    id: 'formula',
    name: 'Fórmula de Cálculo',
    fields: ['equation', 'equationDescription'],
  },
  {
    id: 'stratification',
    name: 'Estratificação',
    fields: [
      'stratifiedByOAC',
      'oac',
      'stratifiedByRegion',
      'region',
      'stratifiedByCompany',
      'company',
      'stratifiedByProject',
      'project',
    ],
  },
]

export const polarity = [
  { value: 'positiva', label: 'Quanto maior, melhor' },
  { value: 'negativa', label: 'Quanto menor, melhor' },
]

export const periodicity = [
  { value: 'mensal', label: 'Mensal' },
  { value: 'trimestral', label: 'Trimestral' },
  { value: 'semestral', label: 'Semestral' },
  { value: 'anual', label: 'Anual' },
  { value: 'eventual', label: 'Eventual' },
]
