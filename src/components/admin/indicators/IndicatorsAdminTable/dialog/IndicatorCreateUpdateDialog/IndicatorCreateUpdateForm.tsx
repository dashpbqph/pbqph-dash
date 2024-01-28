'use client'

import { useState } from 'react'
import { indicatorCreateUpdateFormSchema } from '@/schemas/indicator'
import { api } from '@/trpc/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { MathJax } from 'better-react-mathjax'
import { ArrowRight, Wand2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { DialogButtonSubmit } from '@/components/shared/dialog'
import { Button } from '@/components/ui/button'
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
import { Textarea } from '@/components/ui/textarea'
import type { IndicatorWithRelations, Tab } from '@/types/indicator'
import { periodicity, polarity } from './IndicatorCreateUpdateForm.constants'
import {
  useIndicatorAi,
  useIndicatorFormSubmit,
  useIndicatorFormTabs,
} from './IndicatorCreateUpdateForm.hooks'

type IndicatorCreateUpdateFormProps = {
  indicator?: IndicatorWithRelations
  onClose: () => void
}

export default function IndicatorCreateUpdateForm({
  onClose,
  indicator,
}: IndicatorCreateUpdateFormProps) {
  const isEditing = !!indicator?.id
  const [fixedEquation, setFixedEquation] = useState(false)
  const [fixedUnit, setFixedUnit] = useState(false)
  const { data: systems } = api.system.getAll.useQuery()
  const { data: categories } = api.category.getAll.useQuery()
  const { data: impacts } = api.impact.getAll.useQuery()
  const { data: impactedAgents } = api.impactedAgent.getAll.useQuery()

  const indicatorCreateUpdateForm = useForm<
    z.infer<typeof indicatorCreateUpdateFormSchema>
  >({
    resolver: zodResolver(indicatorCreateUpdateFormSchema),
    defaultValues: {
      code: indicator?.code || '',
      system: indicator?.system.id || '',
      category: indicator?.category.id || '',
      name: indicator?.name || '',
      polarity: indicator?.polarity || '',
      cumulative: indicator?.cumulative || false,
      source: indicator?.source || '',
      periodicity: indicator?.periodicity || '',
      impacts: (indicator?.impacts || []).map((impact) => ({
        value: impact.id,
        label: impact.name,
      })),
      impactedAgents: (indicator?.impactedAgents || []).map(
        (impactedAgent) => ({
          value: impactedAgent.id,
          label: impactedAgent.name,
        }),
      ),
      equation: indicator?.equation || '',
      equationDescription: indicator?.equationDescription || '',
      unit: indicator?.unit || '',
      stratifiedByOAC: indicator?.stratifiedByOAC || false,
      stratifiedByRegion: indicator?.stratifiedByRegion || false,
      stratifiedByCompany: indicator?.stratifiedByCompany || false,
      stratifiedByProject: indicator?.stratifiedByProject || false,
    },
  })

  const {
    textToEquation,
    textToUnit,
    isSubmiting: isLintingText,
  } = useIndicatorAi({
    indicatorCreateUpdateForm,
  })

  async function handleTextToEquation(column: 'code' | 'equation') {
    await textToEquation(column)
    setFixedEquation(true)
  }

  async function handleTextToUnit() {
    await textToUnit()
    setFixedUnit(true)
  }

  const { handleTab, currentTab, setCurrentTab } = useIndicatorFormTabs({
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
          defaultValue="basic"
          value={currentTab}
          onValueChange={(value) => setCurrentTab(value as Tab)}
        >
          <TabsList className="mb-3 grid w-full grid-cols-3">
            <TabsTrigger value="basic">Informações básicas</TabsTrigger>
            <TabsTrigger value="formula">Fórmula de Cálculo</TabsTrigger>
            <TabsTrigger value="stratification">Estratificação</TabsTrigger>
          </TabsList>
          <TabsContent value="basic" className="flex flex-col gap-3">
            <FormField
              control={indicatorCreateUpdateForm.control}
              name="system"
              render={({ field }) => (
                <FormItem className="grid w-full items-center space-y-0.5">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sistema*" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {systems?.map((system) => (
                        <SelectItem key={system.id} value={system.id}>
                          {system.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="font-light text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={indicatorCreateUpdateForm.control}
              name="category"
              render={({ field }) => (
                <FormItem className="grid w-full items-center space-y-0.5">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Categoria*" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="font-light text-red-500" />
                </FormItem>
              )}
            />
            <div className="flex gap-1">
              <FormField
                control={indicatorCreateUpdateForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="w-full space-y-0.5">
                    <FormControl>
                      <Input placeholder="Código*" {...field} />
                    </FormControl>
                    <FormMessage className="font-light text-red-500" />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                className="data-[loading=true]:cursor-not-allowed"
                data-loading={isLintingText}
                disabled={isLintingText}
                onClick={() => handleTextToEquation('code')}
              >
                <Wand2 className="h-4 w-4" />
              </Button>
            </div>
            {fixedEquation && (
              <div className="flex justify-center gap-2 rounded-md bg-muted/60 py-3">
                <MathJax hideUntilTypeset="first" inline dynamic>
                  {`\\(${indicatorCreateUpdateForm.watch('code')}\\)`}
                </MathJax>
              </div>
            )}
            <FormField
              control={indicatorCreateUpdateForm.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full space-y-0.5">
                  <FormControl>
                    <Input placeholder="Nome*" {...field} />
                  </FormControl>
                  <FormMessage className="font-light text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={indicatorCreateUpdateForm.control}
              name="source"
              render={({ field }) => (
                <FormItem className="w-full space-y-0.5">
                  <FormControl>
                    <Input placeholder="Fonte*" {...field} />
                  </FormControl>
                  <FormMessage className="font-light text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={indicatorCreateUpdateForm.control}
              name="polarity"
              render={({ field }) => (
                <FormItem className="grid w-full items-center space-y-0.5">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Polaridade*" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {polarity.map((polarity) => (
                        <SelectItem key={polarity.value} value={polarity.value}>
                          {polarity.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="font-light text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={indicatorCreateUpdateForm.control}
              name="periodicity"
              render={({ field }) => (
                <FormItem className="grid w-full items-center space-y-0.5">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Periodicidade*" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {periodicity.map((periodicity) => (
                        <SelectItem
                          key={periodicity.value}
                          value={periodicity.value}
                        >
                          {periodicity.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="font-light text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={indicatorCreateUpdateForm.control}
              name="impacts"
              render={({ field }) => (
                <FormItem className="grid w-full items-center space-y-0.5">
                  <MultiSelect
                    placeholder="Natureza do impacto"
                    selected={field.value}
                    options={(impacts || []).map((impact) => ({
                      value: impact.id,
                      label: impact.name,
                    }))}
                    {...field}
                  />
                  <FormMessage className="font-light text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={indicatorCreateUpdateForm.control}
              name="impactedAgents"
              render={({ field }) => (
                <FormItem className="grid w-full items-center space-y-0.5">
                  <MultiSelect
                    placeholder="Agentes impactados"
                    selected={field.value}
                    options={(impactedAgents || []).map((impactedAgent) => ({
                      value: impactedAgent.id,
                      label: impactedAgent.name,
                    }))}
                    {...field}
                  />
                  <FormMessage className="font-light text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={indicatorCreateUpdateForm.control}
              name="cumulative"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Input
                      className="h-4 w-4"
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal leading-none">
                    Medições Cumulativas
                  </FormLabel>
                  <FormMessage className="font-light text-red-500" />
                </FormItem>
              )}
            />
            <Button
              type="button"
              className="mt-1 flex w-full flex-row gap-2 data-[loading=true]:cursor-not-allowed"
              data-loading={isLintingText}
              disabled={isLintingText}
              onClick={() => handleTab('basic')}
            >
              Avançar
              <ArrowRight className="h-5 w-5" />
            </Button>
          </TabsContent>
          <TabsContent value="formula" className="flex flex-col gap-3">
            <div className="flex gap-1">
              <FormField
                control={indicatorCreateUpdateForm.control}
                name="equation"
                render={({ field }) => (
                  <FormItem className="w-full space-y-0.5">
                    <FormControl>
                      <Input placeholder="Fórmula de cálculo*" {...field} />
                    </FormControl>
                    <FormMessage className="font-light text-red-500" />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                className="data-[loading=true]:cursor-not-allowed"
                data-loading={isLintingText}
                disabled={isLintingText}
                onClick={() => handleTextToEquation('equation')}
              >
                <Wand2 className="h-4 w-4" />
              </Button>
            </div>
            {fixedEquation && (
              <div className="flex justify-center gap-2 rounded-md bg-muted/60 py-3">
                <MathJax hideUntilTypeset="first" inline dynamic>
                  {`\\(${indicatorCreateUpdateForm.watch('equation')}\\)`}
                </MathJax>
              </div>
            )}
            <FormField
              control={indicatorCreateUpdateForm.control}
              name="equationDescription"
              render={({ field }) => (
                <FormItem className="w-full space-y-0.5">
                  <FormControl>
                    <Textarea
                      className="max-h-[200px] min-h-[100px]"
                      placeholder="Descrição da fórmula de cálculo*"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="font-light text-red-500" />
                </FormItem>
              )}
            />
            <div className="flex gap-1">
              <FormField
                control={indicatorCreateUpdateForm.control}
                name="unit"
                render={({ field }) => (
                  <FormItem className="w-full space-y-0.5">
                    <FormControl>
                      <Input placeholder="Unidade de medida*" {...field} />
                    </FormControl>
                    <FormMessage className="font-light text-red-500" />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                className="data-[loading=true]:cursor-not-allowed"
                data-loading={isLintingText}
                disabled={isLintingText}
                onClick={handleTextToUnit}
              >
                <Wand2 className="h-4 w-4" />
              </Button>
            </div>
            {fixedUnit ||
              (isEditing && (
                <div className="flex justify-center gap-2 rounded-md bg-muted/60 py-3">
                  <MathJax hideUntilTypeset="first" inline dynamic>
                    {`\\(${indicatorCreateUpdateForm.watch('unit')}\\)`}
                  </MathJax>
                </div>
              ))}
            <Button
              type="button"
              className="mt-1 flex w-full flex-row gap-2 data-[loading=true]:cursor-not-allowed"
              data-loading={isLintingText}
              disabled={isLintingText}
              onClick={() => handleTab('formula')}
            >
              Avançar
              <ArrowRight className="h-5 w-5" />
            </Button>
          </TabsContent>
          <TabsContent value="stratification" className="flex flex-col gap-3">
            <FormField
              control={indicatorCreateUpdateForm.control}
              name="stratifiedByRegion"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Input
                      className="h-4 w-4"
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal leading-none">
                    por região do Brasil
                  </FormLabel>
                  <FormMessage className="font-light text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={indicatorCreateUpdateForm.control}
              name="stratifiedByOAC"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Input
                      className="h-4 w-4"
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal leading-none">
                    por OAC
                  </FormLabel>
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
                    <Input
                      className="h-4 w-4"
                      type="checkbox"
                      checked={field.value}
                      onChange={(checked) => {
                        field.onChange(checked)
                        if (
                          indicatorCreateUpdateForm.getValues(
                            'stratifiedByProject',
                          )
                        )
                          indicatorCreateUpdateForm.setValue(
                            'stratifiedByProject',
                            false,
                          )
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal leading-none">
                    por construtora
                  </FormLabel>
                  <FormMessage className="font-light text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={indicatorCreateUpdateForm.control}
              name="stratifiedByProject"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Input
                      className="h-4 w-4"
                      type="checkbox"
                      checked={field.value}
                      onChange={(checked) => {
                        field.onChange(checked)
                        if (
                          !indicatorCreateUpdateForm.getValues(
                            'stratifiedByCompany',
                          )
                        )
                          indicatorCreateUpdateForm.setValue(
                            'stratifiedByCompany',
                            true,
                          )
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal leading-none">
                    por obra
                  </FormLabel>
                  <FormMessage className="font-light text-red-500" />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogButtonSubmit isLoading={isSubmiting} subject="indicador" />
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  )
}
