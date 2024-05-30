import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc'
import {
  Category,
  ImpactedAgent,
  ImpactNature,
  Periodicity,
  Polarity,
  Region,
  SystemAbbrev,
  SystemType,
} from '@prisma/client'
import { z } from 'zod'

export const indicatorRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.indicator.findMany()
  }),
  getAllWithRelations: publicProcedure.query(({ ctx }) => {
    return ctx.db.indicator.findMany({
      include: {
        system: true,
        values: {
          include: {
            company: true,
            project: true,
            oac: true,
            psq: true,
            guideline: true,
          },
        },
      },
    })
  }),
  getIndicatorById: publicProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
    return ctx.db.indicator.findUnique({
      where: {
        id: input.id,
      },
      include: {
        values: {
          include: {
            company: true,
            project: true,
            oac: true,
            psq: true,
            guideline: true,
          },
        },
      },
    })
  }),
  create: protectedProcedure
    .input(
      z.object({
        code: z.string(),
        codeMathJax: z.string(),
        system: z.string(),
        category: z.string(),
        name: z.string(),
        purpose: z.string(),
        unit: z.string(),
        polarity: z.string(),
        cumulative: z.boolean(),
        source: z.string(),
        periodicity: z.string(),
        impactNatures: z.array(z.custom<ImpactNature>()),
        impactedAgents: z.array(z.custom<ImpactedAgent>()),
        equationMathJax: z.string(),
        stratifiedByOAC: z.boolean(),
        stratifiedByPSQ: z.boolean(),
        stratifiedByGuideline: z.boolean(),
        stratifiedByRegion: z.boolean(),
        stratifiedByCompany: z.boolean(),
        stratifiedByProject: z.boolean(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const system = input.system.split('-')
      return ctx.db.indicator.create({
        data: {
          code: input.code,
          codeMathJax: input.codeMathJax,
          system: {
            connect: {
              // eslint-disable-next-line camelcase
              abbrev_type: {
                abbrev: system[0] as SystemAbbrev,
                type: system[1] ? SystemType.NAO_SE_APLICA : (system[1] as SystemType),
              },
            },
          },
          category: input.category as Category,
          name: input.name,
          purpose: input.purpose,
          unit: input.unit,
          equationMathJax: input.equationMathJax,
          polarity: input.polarity as Polarity,
          cumulative: input.cumulative,
          source: input.source,
          periodicity: input.periodicity as Periodicity,
          impactNatures: input.impactNatures as ImpactNature[],
          impactedAgents: input.impactedAgents as ImpactedAgent[],
          stratifiedByOAC: input.stratifiedByOAC,
          stratifiedByPSQ: input.stratifiedByPSQ,
          stratifiedByGuideline: input.stratifiedByGuideline,
          stratifiedByRegion: input.stratifiedByRegion,
          stratifiedByCompany: input.stratifiedByCompany,
          stratifiedByProject: input.stratifiedByProject,
        },
      })
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        code: z.string(),
        codeMathJax: z.string(),
        system: z.string(),
        category: z.string(),
        name: z.string(),
        purpose: z.string(),
        unit: z.string(),
        polarity: z.string(),
        cumulative: z.boolean(),
        source: z.string(),
        periodicity: z.string(),
        impactNatures: z.array(z.custom<ImpactNature>()),
        impactedAgents: z.array(z.custom<ImpactedAgent>()),
        equationMathJax: z.string(),
        stratifiedByOAC: z.boolean(),
        stratifiedByPSQ: z.boolean(),
        stratifiedByGuideline: z.boolean(),
        stratifiedByRegion: z.boolean(),
        stratifiedByCompany: z.boolean(),
        stratifiedByProject: z.boolean(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const system = input.system.split('-')
      return ctx.db.indicator.update({
        where: {
          id: input.id,
        },
        data: {
          code: input.code,
          system: {
            connect: {
              // eslint-disable-next-line camelcase
              abbrev_type: {
                abbrev: system[0] as SystemAbbrev,
                type: system[1] ? SystemType.NAO_SE_APLICA : (system[1] as SystemType),
              },
            },
          },
          category: input.category as Category,
          name: input.name,
          purpose: input.purpose,
          unit: input.unit,
          equationMathJax: input.equationMathJax,
          polarity: input.polarity as Polarity,
          cumulative: input.cumulative,
          source: input.source,
          periodicity: input.periodicity as Periodicity,
          impactNatures: input.impactNatures as ImpactNature[],
          impactedAgents: input.impactedAgents as ImpactedAgent[],
          stratifiedByOAC: input.stratifiedByOAC,
          stratifiedByPSQ: input.stratifiedByPSQ,
          stratifiedByGuideline: input.stratifiedByGuideline,
          stratifiedByRegion: input.stratifiedByRegion,
          stratifiedByCompany: input.stratifiedByCompany,
          stratifiedByProject: input.stratifiedByProject,
        },
      })
    }),
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ ctx, input }) => {
    return ctx.db.indicator.delete({
      where: {
        id: input.id,
      },
    })
  }),

  // values
  getValuesByIndicatorId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.db.indicatorValue.findMany({
        where: {
          indicatorId: input.id,
        },
        include: {
          indicator: true,
          company: true,
          project: true,
          oac: true,
          psq: true,
          guideline: true,
        },
      })
    }),
  upsertValues: publicProcedure
    .input(
      z.object({
        indicatorId: z.string(),
        values: z.array(
          z.object({
            id: z.string(),
            date: z.date(),
            value: z.number(),
            region: z.string().nullable().optional(),
            company: z.string().nullable().optional(),
            project: z.string().nullable().optional(),
            oac: z.string().nullable().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // get all values from the indicator
      const allValues = await ctx.db.indicatorValue.findMany({
        where: {
          indicatorId: input.indicatorId,
        },
      })

      // delete values that are not in the input
      const deletePromises = allValues
        .filter((value) => !input.values.map((value) => value.id).includes(value.id))
        .map(({ id }) => {
          return ctx.db.indicatorValue.delete({
            where: {
              id,
            },
          })
        })

      // update values that are in the input
      type CreateUpdateData = {
        createdAt: Date
        updatedAt: Date
        value: number
        indicator: {
          connect: {
            id: string
          }
        }
        region?: Region
        company?: {
          connect: {
            id: string
          }
        }
        project?: {
          connect: {
            id: string
          }
        }
        oac?: {
          connect: {
            id: string
          }
        }
      }
      const updatePromises = input.values
        .filter((value) => value.id !== '')
        .map(({ id, date, value, ...strats }) => {
          let updateData: Omit<CreateUpdateData, 'indicator'> = {
            createdAt: date,
            updatedAt: new Date(),
            value,
          }
          if (strats.region) {
            updateData = {
              ...updateData,
              region: strats.region as Region,
            }
          }
          if (strats.company) {
            updateData = {
              ...updateData,
              company: {
                connect: {
                  id: strats.company,
                },
              },
            }
          }
          if (strats.project) {
            updateData = {
              ...updateData,
              project: {
                connect: {
                  id: strats.project,
                },
              },
            }
          }
          if (strats.oac) {
            updateData = {
              ...updateData,
              oac: {
                connect: {
                  id: strats.oac,
                },
              },
            }
          }
          return ctx.db.indicatorValue.update({
            where: {
              id,
            },
            data: updateData,
          })
        })

      // create values that are not in the input
      const createPromises = input.values
        .filter((value) => value.id === '')
        .map(({ date, value, ...strats }) => {
          let createData: CreateUpdateData = {
            createdAt: date,
            updatedAt: new Date(),
            value,
            indicator: {
              connect: {
                id: input.indicatorId,
              },
            },
          }
          if (strats.region) {
            createData = {
              ...createData,
              region: strats.region as Region,
            }
          }
          if (strats.company) {
            createData = {
              ...createData,
              company: {
                connect: {
                  id: strats.company,
                },
              },
            }
          }
          if (strats.project) {
            createData = {
              ...createData,
              project: {
                connect: {
                  id: strats.project,
                },
              },
            }
          }
          if (strats.oac) {
            createData = {
              ...createData,
              oac: {
                connect: {
                  id: strats.oac,
                },
              },
            }
          }
          return ctx.db.indicatorValue.create({
            data: createData,
          })
        })

      // execute all promises
      return ctx.db.$transaction([...deletePromises, ...updatePromises, ...createPromises])
    }),
})
