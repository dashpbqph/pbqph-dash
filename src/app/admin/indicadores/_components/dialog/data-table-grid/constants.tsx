import { Periodicity, type Region } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { format, getMonth, getQuarter } from 'date-fns'
import { Check, Pencil, Trash } from 'lucide-react'

import type { IndicatorValuesWithRelation } from '@/types/indicator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Markdown from '@/app/_providers/markdown-provider'

const mapRegion = {
  NORTE: 'Norte',
  NORDESTE: 'Nordeste',
  CENTRO_OESTE: 'Centro-Oeste',
  SUDESTE: 'Sudeste',
  SUL: 'Sul',
}

const mapPeriod = {
  [Periodicity.EVENTUAL]: 'eventual',
  [Periodicity.ANUAL]: 'anual',
  [Periodicity.TRIMESTRAL]: 'trimestre',
  [Periodicity.SEMESTRAL]: 'semestre',
}

const mapPeriodFn = {
  [Periodicity.ANUAL]: (date: Date) => getQuarter(date),
  [Periodicity.TRIMESTRAL]: (date: Date) => getQuarter(date),
  [Periodicity.SEMESTRAL]: (date: Date) => Math.ceil(getMonth(date) / 6) + 1,
}

type GetColumnsProps = {
  idEditValues: string[]
  setIdEditValues: (ids: string[]) => void
  indicatorValues: IndicatorValuesWithRelation[]
  setIndicatorValues: (values: IndicatorValuesWithRelation[]) => void
  companies: { id: string; name: string }[]
  projects: { id: string; name: string; companyId: string }[]
  oacs: { id: string; name: string }[]
  psqs: { id: string; name: string }[]
  guidelines: { id: string; name: string }[]
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
  psqs,
  guidelines,
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
          mapPeriod[indicatorValue.indicator.periodicity as keyof typeof mapPeriod]
        const periodFn =
          mapPeriodFn[indicatorValue.indicator.periodicity as keyof typeof mapPeriodFn]
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
                {periodicity === 'eventual' ? (
                  <span>{format(date, 'dd/MM/yyyy')}</span>
                ) : (
                  <>
                    {periodicity !== 'anual' && (
                      <>
                        <span>{periodFn(row.original.createdAt)}</span>º <span>{periodicity}</span>{' '}
                        de{' '}
                      </>
                    )}
                    <span>{format(date, 'yyyy')}</span>
                  </>
                )}
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
          <div className="flex min-w-[140px] items-center justify-center gap-1 px-2 text-center">
            {isEditing ? (
              <Input
                type="number"
                className="max-w-[120px] border-none text-center shadow-none"
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
            {!['absoluta', 'adimensional'].includes(unit) && !isEditing && (
              <Markdown>{`${unit}`}</Markdown>
            )}
          </div>
        )
      },
    },
    {
      id: 'psq',
      header: () => <div className="hidden lg:block">PSQ</div>,
      cell: ({ row }) => {
        const indicatorValue = row.original
        const isEditing = idEditValues.includes(indicatorValue.id)
        return (
          <div className="min-w-[300px] text-left">
            {isEditing ? (
              <Select
                value={psqs.find((value) => value.id === indicatorValue.psqId)?.id ?? undefined}
                onValueChange={(newValue) => {
                  const newValues = indicatorValues.map((value) => {
                    if (value.id === indicatorValue.id) {
                      return {
                        ...value,
                        psqId: newValue as string,
                        psq: {
                          id: newValue as string,
                          name: projects.find((project) => project.id === newValue)?.name as string,
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
                <SelectTrigger className="w-[300px] border-none text-center shadow-none">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="w-[300px]">
                  {psqs.map((psq) => (
                    <SelectItem key={psq.id} value={psq.id}>
                      {psq.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              row.original.psq?.name
            )}
          </div>
        )
      },
    },
    {
      id: 'guideline',
      header: () => <div className="hidden lg:block">Diretriz</div>,
      cell: ({ row }) => {
        const indicatorValue = row.original
        const isEditing = idEditValues.includes(indicatorValue.id)
        return (
          <div className="min-w-[140px] text-left">
            {isEditing ? (
              <Select
                value={
                  guidelines.find((value) => value.id === indicatorValue.guidelineId)?.id ??
                  undefined
                }
                onValueChange={(newValue) => {
                  const newValues = indicatorValues.map((value) => {
                    if (value.id === indicatorValue.id) {
                      return {
                        ...value,
                        guidelineId: newValue as string,
                        guideline: {
                          id: newValue as string,
                          name: projects.find((project) => project.id === newValue)?.name as string,
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
                  {guidelines.map((guideline) => (
                    <SelectItem key={guideline.id} value={guideline.id}>
                      {guideline.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              row.original.guideline?.name
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
          <div className="min-w-[140px] text-left">
            {isEditing ? (
              <Select
                value={
                  (indicatorValues.find((value) => value.id === indicatorValue.id)
                    ?.region as Region) ?? undefined
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
          <div className="min-w-[140px] px-2 text-left">
            {isEditing ? (
              <Select
                value={
                  companies.find((value) => value.id === indicatorValue.companyId)?.id ?? undefined
                }
                onValueChange={(newValue) => {
                  const newValues = indicatorValues.map((value) => {
                    if (value.id === indicatorValue.id) {
                      return {
                        ...value,
                        companyId: newValue as string,
                        company: {
                          id: newValue as string,
                          name: companies.find((company) => company.id === newValue)
                            ?.name as string,
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
                <SelectTrigger className="w-36 border-none text-left shadow-none">
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
          <div className="min-w-[140px] px-2 text-left">
            {isEditing ? (
              <Select
                value={
                  projects.find((value) => value.id === indicatorValue.projectId)?.id ?? undefined
                }
                onValueChange={(newValue) => {
                  const newValues = indicatorValues.map((value) => {
                    if (value.id === indicatorValue.id) {
                      return {
                        ...value,
                        projectId: newValue as string,
                        project: {
                          id: newValue as string,
                          name: projects.find((project) => project.id === newValue)?.name as string,
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
                    .filter((project) => project.companyId === indicatorValue.companyId)
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
          <div className="min-w-[140px] text-left">
            {isEditing ? (
              <Select
                value={oacs.find((value) => value.id === indicatorValue.oacId)?.id ?? undefined}
                onValueChange={(newValue) => {
                  const newValues = indicatorValues.map((value) => {
                    if (value.id === indicatorValue.id) {
                      return {
                        ...value,
                        oacId: newValue as string,
                        oac: {
                          id: newValue as string,
                          name: projects.find((project) => project.id === newValue)?.name as string,
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
          <div className="flex items-center justify-center gap-1 px-2">
            <Button
              variant="outline"
              className="aspect-square bg-white p-1"
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
              className="aspect-square bg-white p-1"
              onClick={() => {
                setIdDeleteValues([...idDeleteValues, indicatorValue.id])
                setIndicatorValues(
                  indicatorValues.filter((value) => value.id !== indicatorValue.id),
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
