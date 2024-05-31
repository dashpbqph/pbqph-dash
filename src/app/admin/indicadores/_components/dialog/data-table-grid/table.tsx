'use client'

import { useEffect, useState } from 'react'
import { api } from '@/trpc/react'

import { IndicatorValuesWithRelation, IndicatorWithRelations } from '@/types/indicator'
import { DataTable } from '@/components/ui/data-table'

import { getColumns } from './constants'
import { useDataTableToolbar } from './toolbar'

type IndicatorDataTableGridProps = {
  indicator: IndicatorWithRelations
  indicatorValues: IndicatorValuesWithRelation[]
  setIndicatorValues: (values: IndicatorValuesWithRelation[]) => void
}

export default function IndicatorDataTableGrid({
  indicator,
  indicatorValues,
  setIndicatorValues,
}: IndicatorDataTableGridProps) {
  const [defaultIndicatorValues, { refetch }] =
    api.indicator.getValuesByIndicatorId.useSuspenseQuery({ id: indicator.id })
  const { data: companies } = api.company.getAllWithProjects.useQuery(undefined, {
    enabled: !indicator.stratifiedByCompany,
  })
  const { data: projects } = api.project.getAllWithRelations.useQuery(undefined, {
    enabled: !indicator.stratifiedByProject,
  })
  const { data: oacs } = api.entity.getAllOACs.useQuery(undefined, {
    enabled: !indicator.stratifiedByOAC,
  })
  const { data: psqs } = api.entity.getAllPSQS.useQuery(undefined, {
    enabled: !indicator.stratifiedByPSQ,
  })
  const { data: guidelines } = api.entity.getAllGuidelines.useQuery(undefined, {
    enabled: !indicator.stratifiedByGuideline,
  })
  const [idEditValues, setIdEditValues] = useState<string[]>([])
  const [idDeleteValues, setIdDeleteValues] = useState<string[]>([])

  useEffect(
    () => setIndicatorValues(defaultIndicatorValues),
    [defaultIndicatorValues, setIndicatorValues],
  )

  const columns = getColumns({
    idEditValues,
    setIdEditValues,
    indicatorValues,
    setIndicatorValues,
    companies: (companies || []).map((company) => ({
      id: company.id,
      name: company.name,
    })),
    projects: (projects || []).map((project) => ({
      id: project.id,
      name: project.name,
      companyId: project.companyId,
    })),
    oacs: (oacs || []).map((oac) => ({
      id: oac.id,
      name: oac.name,
    })),
    psqs: (psqs || []).map((psq) => ({
      id: psq.id,
      name: psq.name,
    })),
    guidelines: (guidelines || []).map((guideline) => ({
      id: guideline.id,
      name: guideline.name,
    })),
    idDeleteValues,
    setIdDeleteValues,
    refetchIndicators: refetch,
  })

  const { DataTableToolbar } = useDataTableToolbar({
    indicator,
    indicatorValues,
    setIndicatorValues,
    idEditValues,
    setIdEditValues,
  })

  return (
    <DataTable
      data={indicatorValues}
      columns={columns}
      toolbar={DataTableToolbar}
      pageSize={5}
      subject="valores"
      columnVisibilityDefault={{
        region: indicator.stratifiedByRegion,
        company: indicator.stratifiedByCompany,
        project: indicator.stratifiedByProject,
        oac: indicator.stratifiedByOAC,
        psq: indicator.stratifiedByPSQ,
        guideline: indicator.stratifiedByGuideline,
      }}
      border
    />
  )
}
