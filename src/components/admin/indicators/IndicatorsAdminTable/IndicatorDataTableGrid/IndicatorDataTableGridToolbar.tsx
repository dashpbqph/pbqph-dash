/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
  IndicatorValuesWithRelation,
  IndicatorWithRelations,
} from '@/types/indicator'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  refetchFn: () => void
}

interface DataTableToolbarHookProps {
  indicator: IndicatorWithRelations
  indicatorValues: IndicatorValuesWithRelation[]
  setIndicatorValues: (values: IndicatorValuesWithRelation[]) => void
  idEditValues: string[]
  setIdEditValues: (values: string[]) => void
}

export function useDataTableToolbar({
  indicator,
  indicatorValues,
  setIndicatorValues,
  idEditValues,
  setIdEditValues,
}: DataTableToolbarHookProps) {
  function createNewValue() {
    const {
      impacts,
      impactedAgents,
      system,
      category,
      values,
      ...indicatorWithoutRelations
    } = indicator
    return {
      id: '',
      value: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      indicatorId: indicator.id,
      indicator: indicatorWithoutRelations,
      region: null,
      company: null,
      companyId: null,
      project: null,
      projectId: null,
      oac: null,
      oacId: null,
    }
  }
  function DataTableToolbar<TData>({
    table,
    refetchFn,
  }: DataTableToolbarProps<TData>) {
    const newValue = createNewValue()
    return (
      <div className="flex items-center justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => {
            setIndicatorValues([...indicatorValues, newValue])
            setIdEditValues([...idEditValues, newValue.id])
          }}
        >
          Nova medição
        </Button>
      </div>
    )
  }

  return { DataTableToolbar }
}
