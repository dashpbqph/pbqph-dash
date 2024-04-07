import type { Region } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { MathJax } from 'better-react-mathjax'
import { format, getMonth, getQuarter } from 'date-fns'
import { Check, Pencil, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { IndicatorValuesWithRelation } from '@/types/indicator'

const mapRegion = {
  NORTE: 'Norte',
  NORDESTE: 'Nordeste',
  CENTRO_OESTE: 'Centro-Oeste',
  SUDESTE: 'Sudeste',
  SUL: 'Sul',
}

const mapPeriod = {
  anual: 'ano',
  mensal: 'mês',
  bimestral: 'bimestre',
  trimestral: 'trimestre',
  semestral: 'semestre',
}

const mapPeriodFn = {
  anual: (date: Date) => getQuarter(date),
  mensal: (date: Date) => getMonth(date) + 1, // Adiciona 1 pois os meses começam de 0
  bimestral: (date: Date) => getQuarter(date) * 2,
  trimestral: (date: Date) => getQuarter(date),
  semestral: (date: Date) => Math.ceil(getMonth(date) / 6), // Divide por 6 e arredonda para cima
}

type GetColumnsProps = {
  idEditValues: string[]
  setIdEditValues: (ids: string[]) => void
  indicatorValues: IndicatorValuesWithRelation[]
  setIndicatorValues: (values: IndicatorValuesWithRelation[]) => void
  companies: { id: string; name: string }[]
  projects: { id: string; name: string; companyId: string }[]
  oacs: { id: string; name: string }[]
  idDeleteValues: string[]
  setIdDeleteValues: (ids: string[]) => void
  refetchIndicators: () => void
}

export const getColumns = ({
  idEditValues,
  setIdEditValues,
  indicatorValues,
  companies,
  projects,
  oacs,
  idDeleteValues,
  setIdDeleteValues,
  setIndicatorValues,
}: GetColumnsProps): ColumnDef<IndicatorValuesWithRelation>[] => {
  return [
    {
      id: 'period',
      header: () => <div className="pl-4">Período</div>,
      cell: ({ row }) => {
        const indicatorValue = row.original
        const isEditing = idEditValues.includes(indicatorValue.id)
        const periodicity =
          mapPeriod[
            indicatorValue.indicator.periodicity as keyof typeof mapPeriod
          ]
        const periodFn =
          mapPeriodFn[
            indicatorValue.indicator.periodicity as keyof typeof mapPeriodFn
          ]
        const date = row.original.createdAt
        return (
          <div className="min-w-[240px] pl-4 text-left">
            {isEditing ? (
              <Input
                type="date"
                className="w-36 items-center border-none shadow-none"
                defaultValue={format(row.original.createdAt, 'yyyy-MM-dd')}
                max={format(new Date(), 'yyyy-MM-dd')}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onChange={(e) => {
                  e.preventDefault()
                  const newValue = e.target.value
                  const newValues = indicatorValues.map((value) => {
                    if (value.id === indicatorValue.id) {
                      return {
                        ...value,
                        createdAt: new Date(newValue + 'T00:00:00'),
                      }
                    }
                    return value
                  })
                  setIndicatorValues(newValues)
                }}
              />
            ) : (
              <>
                {periodicity !== 'ano' && (
                  <>
                    <span>{periodFn(row.original.createdAt)}</span>º{' '}
                    <span>{periodicity}</span> de{' '}
                  </>
                )}
                <span>{format(date, 'yyyy')}</span>
              </>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'value',
      header: () => <div className="hidden text-center lg:block">Valor</div>,
      cell: ({ row }) => {
        const indicatorValue = row.original
        const isEditing = idEditValues.includes(indicatorValue.id)
        const unit = row.original.indicator.unit
        return (
          <div className="flex min-w-[140px] justify-center gap-1 text-center">
            {isEditing ? (
              <Input
                type="number"
                className="w-20 border-none text-center shadow-none"
                defaultValue={row.getValue('value')}
                step={0.1}
                onChange={(e) => {
                  e.preventDefault()
                  const newValue = e.target.value
                  const newValues = indicatorValues.map((value) => {
                    if (value.id === indicatorValue.id) {
                      return { ...value, value: parseFloat(newValue) }
                    }
                    return value
                  })
                  setIndicatorValues(newValues)
                }}
              />
            ) : (
              (row.getValue('value') as number).toLocaleString('pt-BR')
            )}{' '}
            {!['absoluta', 'adimensional'].includes(unit) && (
              <MathJax
                hideUntilTypeset="first"
                inline
                dynamic
                suppressHydrationWarning
              >
                {`\\(${unit}\\)`}
              </MathJax>
            )}
          </div>
        )
      },
    },
    {
      id: 'region',
      header: () => <div className="hidden lg:block">Região</div>,
      cell: ({ row }) => {
        const indicatorValue = row.original
        const isEditing = idEditValues.includes(indicatorValue.id)
        return (
          <div className="min-w-[140px] text-center">
            {isEditing ? (
              <Select
                value={
                  (indicatorValues.find(
                    (value) => value.id === indicatorValue.id,
                  )?.region as Region) ?? undefined
                }
                onValueChange={(newValue) => {
                  const newValues = indicatorValues.map((value) => {
                    if (value.id === indicatorValue.id) {
                      return { ...value, region: newValue as Region }
                    }
                    return value
                  })
                  setIndicatorValues(newValues)
                }}
              >
                <SelectTrigger className="w-36 border-none text-center shadow-none">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(mapRegion).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              mapRegion[row.original.region as Region]
            )}
          </div>
        )
      },
    },
    {
      id: 'company',
      header: () => <div className="hidden lg:block">Construtora</div>,
      cell: ({ row }) => {
        const indicatorValue = row.original
        const isEditing = idEditValues.includes(indicatorValue.id)
        return (
          <div className="min-w-[140px] text-center">
            {isEditing ? (
              <Select
                value={
                  companies.find(
                    (value) => value.id === indicatorValue.companyId,
                  )?.id ?? undefined
                }
                onValueChange={(newValue) => {
                  const newValues = indicatorValues.map((value) => {
                    if (value.id === indicatorValue.id) {
                      return {
                        ...value,
                        companyId: newValue as string,
                        company: {
                          id: newValue as string,
                          name: companies.find(
                            (company) => company.id === newValue,
                          )?.name as string,
                          description: '',
                          createdAt: new Date(),
                          updatedAt: new Date(),
                        },
                      }
                    }
                    return value
                  })
                  setIndicatorValues(newValues)
                }}
              >
                <SelectTrigger className="w-36 border-none text-center shadow-none">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              row.original.company?.name
            )}
          </div>
        )
      },
    },
    {
      id: 'project',
      header: () => <div className="hidden lg:block">Obra</div>,
      cell: ({ row }) => {
        const indicatorValue = row.original
        const isEditing = idEditValues.includes(indicatorValue.id)
        return (
          <div className="min-w-[140px] text-center">
            {isEditing ? (
              <Select
                value={
                  projects.find(
                    (value) => value.id === indicatorValue.projectId,
                  )?.id ?? undefined
                }
                onValueChange={(newValue) => {
                  const newValues = indicatorValues.map((value) => {
                    if (value.id === indicatorValue.id) {
                      return {
                        ...value,
                        projectId: newValue as string,
                        project: {
                          id: newValue as string,
                          name: projects.find(
                            (project) => project.id === newValue,
                          )?.name as string,
                          companyId: '',
                          description: '',
                          createdAt: new Date(),
                          updatedAt: new Date(),
                        },
                      }
                    }
                    return value
                  })
                  setIndicatorValues(newValues)
                }}
              >
                <SelectTrigger className="w-36 border-none text-center shadow-none">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {projects
                    .filter(
                      (project) =>
                        project.companyId === indicatorValue.companyId,
                    )
                    .map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            ) : (
              row.original.project?.name
            )}
          </div>
        )
      },
    },
    {
      id: 'oac',
      header: () => <div className="hidden lg:block">OAC</div>,
      cell: ({ row }) => {
        const indicatorValue = row.original
        const isEditing = idEditValues.includes(indicatorValue.id)
        return (
          <div className="min-w-[140px] text-center">
            {isEditing ? (
              <Select
                value={
                  oacs.find((value) => value.id === indicatorValue.oacId)?.id ??
                  undefined
                }
                onValueChange={(newValue) => {
                  const newValues = indicatorValues.map((value) => {
                    if (value.id === indicatorValue.id) {
                      return {
                        ...value,
                        oacId: newValue as string,
                        oac: {
                          id: newValue as string,
                          name: projects.find(
                            (project) => project.id === newValue,
                          )?.name as string,
                          description: '',
                          createdAt: new Date(),
                          updatedAt: new Date(),
                        },
                      }
                    }
                    return value
                  })
                  setIndicatorValues(newValues)
                }}
              >
                <SelectTrigger className="w-36 border-none text-center shadow-none">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {oacs.map((oac) => (
                    <SelectItem key={oac.id} value={oac.id}>
                      {oac.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              row.original.oac?.name
            )}
          </div>
        )
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const indicatorValue = row.original
        const isEditing = idEditValues.includes(indicatorValue.id)
        const Icon = isEditing ? Check : Pencil
        return (
          <div className="flex items-center justify-center gap-1 pr-2">
            <Button
              variant="outline"
              className="aspect-square p-1"
              onClick={() =>
                setIdEditValues(
                  // if the id is already in the array,
                  // remove it, otherwise add it
                  isEditing
                    ? idEditValues.filter((id) => id !== indicatorValue.id)
                    : [...idEditValues, indicatorValue.id],
                )
              }
            >
              <Icon
                className="h-4 w-4 text-blue-500 data-[editing=true]:text-green-500"
                data-editing={isEditing}
              />
            </Button>
            <Button
              variant="outline"
              className="aspect-square p-1"
              onClick={() => {
                setIdDeleteValues([...idDeleteValues, indicatorValue.id])
                setIndicatorValues(
                  indicatorValues.filter(
                    (value) => value.id !== indicatorValue.id,
                  ),
                )
              }}
            >
              <Trash className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )
      },
    },
  ]
}
