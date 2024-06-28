'use client'

import { RouterOutputs } from '@/server/api/root'
import { Polarity } from '@prisma/client'
import { TrendingDown, TrendingUp } from 'lucide-react'

import { capitalizeWords } from '@/utils/misc'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Markdown from '@/app/_providers/markdown-provider'

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
  const stractification = getStractification({
    stratifiedByRegion: indicator?.stratifiedByRegion || false,
    stratifiedByOAC: indicator?.stratifiedByOAC || false,
    stratifiedByCompany: indicator?.stratifiedByCompany || false,
    stratifiedByProject: indicator?.stratifiedByProject || false,
  })

  return (
    <>
      <h1 className="text-2xl font-medium leading-none text-background">
        <Markdown className="inline-block text-xl text-white">{`$${indicator?.codeMarkdown}$`}</Markdown>
        {' - '}
        {indicator?.name}
      </h1>
      <span className="text-sm font-extralight text-background">{indicator?.purpose}</span>
      <div className="flex flex-col flex-wrap gap-x-3 gap-y-1 sm:flex-row">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex h-12 items-center gap-5 rounded-md bg-primary px-3 text-sm text-background hover:bg-primary/95">
                <Markdown className="text-base text-white">{`$${indicator?.equationMarkdown}$`}</Markdown>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-lg" side="bottom" align="start">
              <Markdown className="text-sm">{`${indicator?.equationVarsMarkdown}`}</Markdown>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex h-12 items-center gap-2 rounded-md bg-primary px-3 text-sm text-background hover:bg-primary/95">
          <span className="font-light">Unidade:</span>
          {indicator?.unit === '%' ? (
            '%'
          ) : (
            <Markdown className="text-base text-white">{`$${indicator?.unit}$`}</Markdown>
          )}
        </div>
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
        />
        {indicator?.cumulative && (
          <div className="flex h-12 items-center gap-5 rounded-md bg-primary px-3 text-sm text-background hover:bg-primary/95">
            <span className="font-regular">Acumulativo</span>{' '}
          </div>
        )}
        {stractification && <DetailsMetaItem label="Estratificação" value={stractification} />}
        <DetailsMetaItem
          label="Periodicidade"
          value={indicator?.periodicity && capitalizeWords(indicator?.periodicity)}
        />
      </div>
    </>
  )
}
