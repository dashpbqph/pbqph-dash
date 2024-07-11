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

import { isAdmin } from '@/utils/auth'

export const indicatorRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ company: z.string().optional() }))
    .query(({ ctx, input }) => {
      if (input.company) {
        return ctx.db.indicator.findMany({
          where: {
            stratifiedByProject: true,
          },
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
          orderBy: {
            index: 'asc',
          },
        })
      }

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
        orderBy: {
          index: 'asc',
        },
      })
    }),
  getAllByCompany: publicProcedure
    .input(z.object({ company: z.string().nullable() }))
    .query(async ({ ctx, input }) => {
      const indicators = await ctx.db.indicator.findMany({
        where: {
          stratifiedByCompany: input.company ? undefined : false,
        },
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
        orderBy: {
          index: 'asc',
        },
      })

      if (!input.company) {
        return indicators
      }

      return indicators.map((indicator) => {
        if (indicator.stratifiedByCompany) {
          return {
            ...indicator,
            values: indicator.values.filter((value) => value.companyId === input.company),
          }
        }

        return indicator
      })
    }),
  getIndicatorById: publicProcedure
    .input(z.object({ id: z.string(), company: z.string().nullable() }))
    .query(async ({ ctx, input }) => {
      const indicator = await ctx.db.indicator.findUnique({
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

      if (indicator?.stratifiedByCompany) {
        if (!input.company) {
          throw new Error('FORBIDDEN')
        }

        return {
          ...indicator,
          values: indicator.values.filter((value) => value.companyId === input.company),
        }
      }

      return indicator
    }),
  create: protectedProcedure
    .input(
      z.object({
        code: z.string(),
        codeMarkdown: z.string(),
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
        equationMarkdown: z.string(),
        equationVarsMarkdown: z.string(),
        stratifiedByOAC: z.boolean(),
        stratifiedByPSQ: z.boolean(),
        stratifiedByGuideline: z.boolean(),
        stratifiedByRegion: z.boolean(),
        stratifiedByCompany: z.boolean(),
        stratifiedByProject: z.boolean(),
      }),
    )
    .mutation(({ ctx, input }) => {
      if (!isAdmin(ctx.session.user.role)) throw new Error('Unauthorized')

      const system = input.system.split('-')
      const systemAbbrev = system[0] as SystemAbbrev
      const systemType = system[1] ? (system[1] as SystemType) : SystemType.NAO_SE_APLICA
      return ctx.db.indicator.create({
        data: {
          code: input.code,
          codeMarkdown: input.codeMarkdown,
          system: {
            connect: {
              // eslint-disable-next-line camelcase
              abbrev_type: {
                abbrev: systemAbbrev,
                type: systemType,
              },
            },
          },
          category: input.category as Category,
          name: input.name,
          purpose: input.purpose,
          unit: input.unit,
          equationMarkdown: input.equationMarkdown,
          equationVarsMarkdown: input.equationVarsMarkdown,
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
        codeMarkdown: z.string(),
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
        equationMarkdown: z.string(),
        equationVarsMarkdown: z.string(),
        stratifiedByOAC: z.boolean(),
        stratifiedByPSQ: z.boolean(),
        stratifiedByGuideline: z.boolean(),
        stratifiedByRegion: z.boolean(),
        stratifiedByCompany: z.boolean(),
        stratifiedByProject: z.boolean(),
      }),
    )
    .mutation(({ ctx, input }) => {
      if (!isAdmin(ctx.session.user.role)) throw new Error('Unauthorized')

      const system = input.system.split('-')
      const systemAbbrev = system[0] as SystemAbbrev
      const systemType = system[1] ? (system[1] as SystemType) : SystemType.NAO_SE_APLICA
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
                abbrev: systemAbbrev,
                type: systemType,
              },
            },
          },
          category: input.category as Category,
          name: input.name,
          purpose: input.purpose,
          unit: input.unit,
          equationMarkdown: input.equationMarkdown,
          equationVarsMarkdown: input.equationVarsMarkdown,
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
    if (!isAdmin(ctx.session.user.role)) throw new Error('Unauthorized')

    return ctx.db.indicator.delete({
      where: {
        id: input.id,
      },
    })
  }),

  // values
  getValuesByIndicatorId: protectedProcedure
    .input(z.object({ id: z.string(), company: z.string().optional() }))
    .query(({ input, ctx }) => {
      if (!input.company && !isAdmin(ctx.session.user.role)) throw new Error('Unauthorized')

      if (input.company) {
        return ctx.db.indicatorValue.findMany({
          where: {
            indicatorId: input.id,
            companyId: input.company,
          },
          include: {
            indicator: true,
            company: true,
            project: true,
            oac: true,
            psq: true,
            guideline: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        })
      }

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
  upsertValues: protectedProcedure
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
      if (ctx.session.user.company === '') throw new Error('Unauthorized')

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
