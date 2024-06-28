'use client'

import { indicatorCreateUpdateFormSchema } from '@/schemas/indicator'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Category,
  ImpactedAgent,
  ImpactNature,
  Periodicity,
  Polarity,
  SystemType,
} from '@prisma/client'
import { ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import type { IndicatorWithRelations, Tab } from '@/types/indicator'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DialogFooter } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { MultiSelect } from '@/components/ui/multi-select'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Markdown from '@/app/_providers/markdown-provider'
import DialogSubmitButton from '@/app/admin/_components/dialog-submit-button'
import FormInputLabel from '@/app/admin/_components/form-input-label'

import { useIndicatorFormSubmit, useIndicatorFormTabs } from './hooks'

const CATEGORY_MAP = {
  [Category.DESEMPENHO]: 'Desempenho',
  [Category.ESTRATEGICO]: 'Estratégico',
  [Category.RESULTADO]: 'Resultado',
}

const POLARITY_MAP = {
  [Polarity.NEGATIVA]: 'Negativa',
  [Polarity.POSITIVA]: 'Positiva',
}

const PERIODICITY_MAP = {
  [Periodicity.EVENTUAL]: 'Eventual',
  [Periodicity.TRIMESTRAL]: 'Trimestral',
  [Periodicity.SEMESTRAL]: 'Semestral',
  [Periodicity.ANUAL]: 'Anual',
}

const IMPACT_NATURES_MAP = {
  [ImpactNature.AMBIENTAL]: 'Ambiental',
  [ImpactNature.ECONOMICA]: 'Econômica',
  [ImpactNature.GERENCIAL]: 'Gerencial',
  [ImpactNature.LEGAL]: 'Legal',
  [ImpactNature.SOCIAL]: 'Social',
  [ImpactNature.TECNOLOGICA]: 'Tecnológica',
}

const IMPACTED_AGENTS_MAP = {
  [ImpactedAgent.EMPRESA_CONSTRUTORA]: 'Empresa Construtora',
  [ImpactedAgent.FABRICANTE]: 'Fabricante',
  [ImpactedAgent.SOCIEDADE]: 'Sociedade',
  [ImpactedAgent.TRABALHADOR]: 'Trabalhador',
}

const SYSTEMS_WITH_TYPE = {
  SiAC: 'SiAC',
  SiMaC: 'SiMaC',
  'SiNAT-CONVENCIONAL': 'SiNAT - Convencional',
  'SiNAT-INOVACAO': 'SiNAT - Inovação',
}

type IndicatorCreateUpdateFormProps = {
  indicator?: IndicatorWithRelations
  onClose: () => void
}

export default function IndicatorCreateUpdateForm({
  onClose,
  indicator,
}: IndicatorCreateUpdateFormProps) {
  const isEditing = !!indicator?.id
  const systemWithType = `${indicator?.system.abbrev}${indicator?.system.type !== SystemType.NAO_SE_APLICA ? '-' + indicator?.system.type : ''}`

  const indicatorCreateUpdateForm = useForm<z.infer<typeof indicatorCreateUpdateFormSchema>>({
    resolver: zodResolver(indicatorCreateUpdateFormSchema),
    defaultValues: {
      code: indicator?.code || '',
      codeMarkdown: indicator?.codeMarkdown || '',
      system: systemWithType,
      category: indicator?.category || '',
      name: indicator?.name || '',
      purpose: indicator?.purpose || '',
      polarity: indicator?.polarity || '',
      cumulative: indicator?.cumulative || false,
      source: indicator?.source || '',
      periodicity: indicator?.periodicity || '',
      impactNatures: (indicator?.impactNatures || []).map((impact) => ({
        value: impact,
        label: IMPACT_NATURES_MAP[impact],
      })),
      impactedAgents: (indicator?.impactedAgents || []).map((agent) => ({
        value: agent,
        label: IMPACTED_AGENTS_MAP[agent],
      })),
      equationMarkdown: indicator?.equationMarkdown || '',
      unit: indicator?.unit || '',
      stratifiedByOAC: indicator?.stratifiedByOAC || false,
      stratifiedByPSQ: indicator?.stratifiedByPSQ || false,
      stratifiedByGuideline: indicator?.stratifiedByGuideline || false,
      stratifiedByRegion: indicator?.stratifiedByRegion || false,
      stratifiedByCompany: indicator?.stratifiedByCompany || false,
      stratifiedByProject: indicator?.stratifiedByProject || false,
    },
  })

  const { handleTab, currentTab } = useIndicatorFormTabs({
    indicatorCreateUpdateForm,
  })

  const { handleSubmit, isSubmiting } = useIndicatorFormSubmit({
    indicator,
    isEditing,
    onClose,
    indicatorCreateUpdateForm,
  })

  return (
    <Form {...indicatorCreateUpdateForm}>
      <form
        className="flex flex-col"
        onSubmit={indicatorCreateUpdateForm.handleSubmit(handleSubmit)}
      >
        <Tabs
          defaultValue="infos"
          value={currentTab}
          onValueChange={(value) => handleTab(value as Tab)}
        >
          <TabsList className="mb-3 grid h-fit w-full grid-cols-3 items-center bg-primary/10 p-1">
            <TabsTrigger
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
              value="infos"
            >
              Informações básicas
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
              value="properties"
            >
              Propriedades
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
              value="stratifications"
            >
              Estratificação
            </TabsTrigger>
          </TabsList>
          <TabsContent value="infos" className="flex flex-col gap-3">
            <div className="flex gap-3">
              <FormField
                control={indicatorCreateUpdateForm.control}
                name="system"
                render={({ field }) => (
                  <div className="relative w-full">
                    <FormInputLabel label="Sistema" />
                    <FormItem className="grid w-full items-center space-y-0.5">
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Nenhum" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(SYSTEMS_WITH_TYPE).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="font-light text-red-500" />
                    </FormItem>
                  </div>
                )}
              />
              <FormField
                control={indicatorCreateUpdateForm.control}
                name="category"
                render={({ field }) => (
                  <div className="relative w-full">
                    <FormInputLabel label="Categoria" />
                    <FormItem className="grid w-full items-center space-y-0.5">
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Nenhuma" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(CATEGORY_MAP).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="font-light text-red-500" />
                    </FormItem>
                  </div>
                )}
              />
            </div>
            <FormField
              control={indicatorCreateUpdateForm.control}
              name="code"
              render={({ field }) => (
                <div className="relative w-full">
                  <FormInputLabel label="Código" />
                  <FormItem className="w-full space-y-0.5">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="font-light text-red-500" />
                  </FormItem>
                </div>
              )}
            />
            <FormField
              control={indicatorCreateUpdateForm.control}
              name="codeMarkdown"
              render={({ field }) => (
                <div className="relative w-full">
                  <FormInputLabel label="Código em Markdown" />
                  <FormItem className="w-full space-y-0.5">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="font-light text-red-500" />
                  </FormItem>
                </div>
              )}
            />
            {currentTab === ('infos' as Tab) && indicatorCreateUpdateForm.watch('codeMarkdown') && (
              <div className="flex justify-center gap-2 rounded-md bg-primary/10 py-3">
                <Markdown>{`${indicatorCreateUpdateForm.watch('codeMarkdown')}`}</Markdown>
              </div>
            )}
            <FormField
              control={indicatorCreateUpdateForm.control}
              name="name"
              render={({ field }) => (
                <div className="relative w-full">
                  <FormInputLabel label="Nome do indicador" />
                  <FormItem className="w-full space-y-0.5">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="font-light text-red-500" />
                  </FormItem>
                </div>
              )}
            />
            <FormField
              control={indicatorCreateUpdateForm.control}
              name="purpose"
              render={({ field }) => (
                <div className="relative w-full">
                  <FormInputLabel label="Finalidade" />
                  <FormItem className="w-full space-y-0.5">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="font-light text-red-500" />
                  </FormItem>
                </div>
              )}
            />
            <FormField
              control={indicatorCreateUpdateForm.control}
              name="source"
              render={({ field }) => (
                <div className="relative w-full">
                  <FormInputLabel label="Fonte" />
                  <FormItem className="w-full space-y-0.5">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="font-light text-red-500" />
                  </FormItem>
                </div>
              )}
            />
            <Button
              type="button"
              className="mt-1 flex w-full flex-row gap-2"
              onClick={() => handleTab('properties')}
            >
              Avançar
              <ArrowRight className="h-5 w-5" />
            </Button>
          </TabsContent>
          <TabsContent value="properties" className="flex flex-col gap-3">
            <div className="flex gap-3">
              <FormField
                control={indicatorCreateUpdateForm.control}
                name="polarity"
                render={({ field }) => (
                  <div className="relative w-full">
                    <FormInputLabel label="Polaridade" />
                    <FormItem className="grid w-full items-center space-y-0.5">
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Nenhuma" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(POLARITY_MAP).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="font-light text-red-500" />
                    </FormItem>
                  </div>
                )}
              />
              <FormField
                control={indicatorCreateUpdateForm.control}
                name="periodicity"
                render={({ field }) => (
                  <div className="relative w-full">
                    <FormInputLabel label="Periodicidade" />
                    <FormItem className="grid w-full items-center space-y-0.5">
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Nenhuma" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(PERIODICITY_MAP).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="font-light text-red-500" />
                    </FormItem>
                  </div>
                )}
              />
            </div>
            <FormField
              control={indicatorCreateUpdateForm.control}
              name="impactNatures"
              render={({ field }) => (
                <div className="relative w-full">
                  <FormInputLabel label="Natureza do impacto" />
                  <FormItem className="grid w-full items-center space-y-0.5">
                    <MultiSelect
                      placeholder="Nenhuma"
                      selected={field.value}
                      options={Object.entries(IMPACT_NATURES_MAP).map(([key, value]) => ({
                        value: key,
                        label: value,
                      }))}
                      {...field}
                    />
                    <FormMessage className="font-light text-red-500" />
                  </FormItem>
                </div>
              )}
            />
            <FormField
              control={indicatorCreateUpdateForm.control}
              name="impactedAgents"
              render={({ field }) => (
                <div className="relative w-full">
                  <FormInputLabel label="Agentes impactados" />
                  <FormItem className="grid w-full items-center space-y-0.5">
                    <MultiSelect
                      placeholder="Nenhum"
                      selected={field.value}
                      options={Object.entries(IMPACTED_AGENTS_MAP).map(([key, value]) => ({
                        value: key,
                        label: value,
                      }))}
                      {...field}
                    />
                    <FormMessage className="font-light text-red-500" />
                  </FormItem>
                </div>
              )}
            />
            <FormField
              control={indicatorCreateUpdateForm.control}
              name="cumulative"
              render={({ field }) => (
                <FormItem className="mb-2 flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Input
                      className="h-4 w-4 accent-primary"
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal leading-none">Medições Cumulativas</FormLabel>
                  <FormMessage className="font-light text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={indicatorCreateUpdateForm.control}
              name="equationMarkdown"
              render={({ field }) => (
                <div className="relative w-full">
                  <FormInputLabel label="Fórmula de cálculo em Markdown" />
                  <FormItem className="w-full space-y-0.5">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="font-light text-red-500" />
                  </FormItem>
                </div>
              )}
            />
            {currentTab === ('properties' as Tab) &&
              indicatorCreateUpdateForm.watch('equationMarkdown') && (
                <div className="flex justify-center gap-2 rounded-md bg-primary/10 py-3">
                  <Markdown>{`${indicatorCreateUpdateForm.watch('equationMarkdown')}`}</Markdown>
                </div>
              )}
            <FormField
              control={indicatorCreateUpdateForm.control}
              name="unit"
              render={({ field }) => (
                <div className="relative w-full">
                  <FormInputLabel label="Unidade de medida em Markdown" />
                  <FormItem className="w-full space-y-0.5">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="font-light text-red-500" />
                  </FormItem>
                </div>
              )}
            />
            {currentTab === ('properties' as Tab) && isEditing && (
              <div className="flex justify-center gap-2 rounded-md bg-primary/10 py-3">
                <Markdown>
                  {indicatorCreateUpdateForm.watch('unit') === '%'
                    ? `\\%`
                    : `${indicatorCreateUpdateForm.watch('unit')}`}
                </Markdown>
              </div>
            )}
            <Button
              type="button"
              className="mt-1 flex w-full flex-row gap-2"
              onClick={() => handleTab('stratifications')}
            >
              Avançar
              <ArrowRight className="h-5 w-5" />
            </Button>
          </TabsContent>
          <TabsContent value="stratifications" className="flex flex-col gap-3">
            {indicatorCreateUpdateForm.watch('system') === 'SiAC' && (
              <FormField
                control={indicatorCreateUpdateForm.control}
                name="stratifiedByOAC"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal leading-none">por OAC</FormLabel>
                    <FormMessage className="font-light text-red-500" />
                  </FormItem>
                )}
              />
            )}
            {indicatorCreateUpdateForm.watch('system') === 'SiMaC' && (
              <FormField
                control={indicatorCreateUpdateForm.control}
                name="stratifiedByPSQ"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal leading-none">por PSQ</FormLabel>
                    <FormMessage className="font-light text-red-500" />
                  </FormItem>
                )}
              />
            )}
            {indicatorCreateUpdateForm.watch('system').includes('SiNAT') && (
              <FormField
                control={indicatorCreateUpdateForm.control}
                name="stratifiedByGuideline"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal leading-none">por Diretriz</FormLabel>
                    <FormMessage className="font-light text-red-500" />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={indicatorCreateUpdateForm.control}
              name="stratifiedByRegion"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="font-normal leading-none">por região do Brasil</FormLabel>
                  <FormMessage className="font-light text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={indicatorCreateUpdateForm.control}
              name="stratifiedByCompany"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked)
                        if (indicatorCreateUpdateForm.getValues('stratifiedByProject'))
                          indicatorCreateUpdateForm.setValue('stratifiedByProject', false)
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal leading-none">por construtora</FormLabel>
                  <FormMessage className="font-light text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={indicatorCreateUpdateForm.control}
              name="stratifiedByProject"
              render={({ field }) => (
                <FormItem className="mb-3 flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked)
                        if (!indicatorCreateUpdateForm.getValues('stratifiedByCompany'))
                          indicatorCreateUpdateForm.setValue('stratifiedByCompany', true)
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal leading-none">por obra</FormLabel>
                  <FormMessage className="font-light text-red-500" />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogSubmitButton
                isUpdating={isEditing}
                isLoading={isSubmiting}
                subject="indicador"
              />
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  )
}
