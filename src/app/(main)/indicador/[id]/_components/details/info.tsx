'use client'

import { useState } from 'react'
import { RouterOutputs } from '@/server/api/root'
import { Polarity } from '@prisma/client'
import { MathJax } from 'better-react-mathjax'
import { TrendingDown, TrendingUp } from 'lucide-react'

import { capitalizeWords } from '@/utils/misc'

import DetailsMetaItem from './metadata'

type Indicator = RouterOutputs['indicator']['getIndicatorById']

function getStractification(stracts: Record<string, boolean> | undefined) {
  const stractification = []
  if (stracts?.stratifiedByRegion) stractification.push('Região')
  if (stracts?.stratifiedByOAC) stractification.push('OAC')
  if (stracts?.stratifiedByCompany) stractification.push('Construtora')
  if (stracts?.stratifiedByProject) stractification.push('Obra')

  if (stractification.length === 0) return false
  return stractification.join(', ')
}

export default function DetailsInfo({ indicator }: { indicator: Indicator }) {
  const [mathJaxLoaded, setMathJaxLoaded] = useState(false)

  const stractification = getStractification({
    stratifiedByRegion: indicator?.stratifiedByRegion || false,
    stratifiedByOAC: indicator?.stratifiedByOAC || false,
    stratifiedByCompany: indicator?.stratifiedByCompany || false,
    stratifiedByProject: indicator?.stratifiedByProject || false,
  })

  return (
    <>
      <h1 className="text-2xl font-medium leading-none text-background" data-testid="title">
        <span className="hidden data-[loaded=true]:inline" data-loaded={mathJaxLoaded}>
          <MathJax
            className="mr-1 text-xl"
            onInitTypeset={() => setMathJaxLoaded(true)}
            inline
            dynamic
            suppressHydrationWarning
          >
            {`\\(${indicator?.codeMathJax}\\)`}
          </MathJax>
        </span>
        {' - '}
        {indicator?.name}
      </h1>
      <span data-testid="objective" className="text-sm font-extralight text-background">
        {indicator?.purpose}
      </span>
      <div className="flex flex-col flex-wrap gap-x-3 gap-y-1 sm:flex-row">
        <div className="flex h-12 items-center gap-5 rounded-md bg-primary px-3 text-sm text-background hover:bg-primary/95">
          <span className="hidden data-[loaded=true]:block" data-loaded={mathJaxLoaded}>
            <MathJax className="text-base" inline dynamic suppressHydrationWarning>
              {`\\(${indicator?.equationMathJax}\\)`}
            </MathJax>
          </span>
        </div>
        <DetailsMetaItem label="Unidade" value={indicator?.unit} />
        <DetailsMetaItem
          label="Polaridade"
          value={
            <div className="flex items-center gap-2">
              {indicator?.polarity === Polarity.POSITIVA ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
            </div>
          }
          data-testid="polarity"
        />
        {indicator?.cumulative && (
          <div className="flex h-12 items-center gap-5 rounded-md bg-primary px-3 text-sm text-background hover:bg-primary/95">
            <span className="font-regular">Acumulativo</span>{' '}
          </div>
        )}
        {stractification && (
          <DetailsMetaItem
            label="Estratificação"
            value={stractification}
            data-testid="stratification"
          />
        )}
        <DetailsMetaItem
          label="Periodicidade"
          value={indicator?.periodicity && capitalizeWords(indicator?.periodicity)}
          data-testid="periodicity"
        />
      </div>
    </>
  )
}
