import { RouterOutputs } from '@/trpc/shared'
import { MathJax } from 'better-react-mathjax'
import { TrendingDown, TrendingUp } from 'lucide-react'

import { Separator } from '@/components/ui/separator'
import DetailsMetaItem from './DetailsMetaItem'

type Indicator = RouterOutputs['indicator']['getIndicatorById']

function titleCase(str: string) {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function getStractification(stracts: Record<string, boolean> | undefined) {
  const stractification = []
  if (!stracts?.stratifiedByRegion) stractification.push('Região')
  if (stracts?.stratifiedByOAC) stractification.push('OAC')
  if (stracts?.stratifiedByCompany) stractification.push('Construtora')
  if (stracts?.stratifiedByProject) stractification.push('Obra')

  if (stractification.length === 0) return false
  return stractification.join(', ')
}

export default function DetailsInfo({ indicator }: { indicator: Indicator }) {
  const stractification = getStractification({
    stratifiedByRegion: indicator?.stratifiedByRegion || false,
    stratifiedByOAC: indicator?.stratifiedByOAC || false,
    stratifiedByCompany: indicator?.stratifiedByCompany || false,
    stratifiedByProject: indicator?.stratifiedByProject || false,
  })

  return (
    <>
      <h1 className="text-2xl font-medium text-black">
        <MathJax className="text-xl" hideUntilTypeset="first" inline dynamic>
          {`\\(${indicator?.code}\\)`}
        </MathJax>
        {' - '}
        {indicator?.name}
      </h1>
      <span>
        O objetivo é acompanhar, a cada ano, a tendência de variação da
        quantidade de novas empresas construtoras certificadas no SiAC –
        Execução de Obras, por região do País. Ele permite avaliar o desempenho
        do Sistema na medida em que aponta a sua capacidade de atrair novas
        empresas construtoras nas diferentes regiões do País, sinalizando
        eventuais desequilíbrios ou melhoria na situação regional quanto à
        certificação.
      </span>
      <Separator />
      <div className="flex flex-col flex-wrap gap-3 sm:flex-row sm:gap-5">
        <DetailsMetaItem
          label="Fórmula"
          value={
            <MathJax
              className="text-base"
              hideUntilTypeset="first"
              inline
              dynamic
            >
              {`\\(${indicator?.equation}\\)`}
            </MathJax>
          }
        />
        <DetailsMetaItem
          label="Unidade"
          value={indicator?.unit && titleCase(indicator?.unit)}
        />
        <DetailsMetaItem
          label="Polaridade"
          value={
            <div className="flex items-center gap-2">
              {indicator?.polarity === 'positiva' ? (
                <>
                  <TrendingUp className="h-5 w-5" />
                  Quanto maior, melhor
                </>
              ) : (
                <>
                  <TrendingDown className="h-5 w-5" />
                  Quanto menor, melhor
                </>
              )}
            </div>
          }
        />
        <DetailsMetaItem
          label="Acumulativo"
          value={indicator?.cumulative ? 'Sim' : 'Não'}
        />
        {stractification && (
          <DetailsMetaItem label="Estratificação" value={stractification} />
        )}
        <DetailsMetaItem
          label="Periodicidade"
          value={indicator?.periodicity && titleCase(indicator?.periodicity)}
        />
      </div>
    </>
  )
}
