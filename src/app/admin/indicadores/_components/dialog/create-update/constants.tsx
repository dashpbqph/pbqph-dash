import type { Tab } from '@/types/indicator'

export const steps: Array<{ id: Tab; name: string; fields: string[] }> = [
  {
    id: 'infos',
    name: 'Informações básicas',
    fields: ['system', 'category', 'code', 'codeMathJax', 'name', 'source'],
  },
  {
    id: 'properties',
    name: 'Propriedades',
    fields: [
      'polarity',
      'periodicity',
      'impactNatures',
      'impactedAgents',
      'cumulative',
      'equationMathJax',
      'unit',
    ],
  },
  {
    id: 'stratifications',
    name: 'Estratificação',
    fields: [
      'stratifiedByOAC',
      'oac',
      'stratifiedByPSQ',
      'psq',
      'stratifiedByGuideline',
      'guideline',
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
