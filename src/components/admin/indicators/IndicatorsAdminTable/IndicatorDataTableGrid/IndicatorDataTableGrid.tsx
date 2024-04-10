'use client'

import { useEffect, useState } from 'react'
import { api } from '@/trpc/react'

import DataTable from '@/components/shared/DataTable'
import {
  IndicatorValuesWithRelation,
  IndicatorWithRelations,
} from '@/types/indicator'
import { getColumns } from './IndicatorDataTableGrid.constants'
import { useDataTableToolbar } from './IndicatorDataTableGridToolbar'

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
  const [companies] = api.company.getAllWithProjects.useSuspenseQuery()
  const [projects] = api.project.getAllWithRelations.useSuspenseQuery()
  const [oacs] = api.oac.getAll.useSuspenseQuery()
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
    companies: companies.map((company) => ({
      id: company.id,
      name: company.name,
    })),
    projects: projects.map((project) => ({
      id: project.id,
      name: project.name,
      companyId: project.companyId,
    })),
    oacs: oacs.map((oac) => ({
      id: oac.id,
      name: oac.name,
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
      pageSize={7}
      subject="valores"
      columnVisibilityDefault={{
        region: indicator.stratifiedByRegion,
        company: indicator.stratifiedByCompany,
        project: indicator.stratifiedByProject,
        oac: indicator.stratifiedByOAC,
      }}
    />
  )
}
