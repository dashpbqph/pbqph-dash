import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc'
import { Region } from '@prisma/client'
import { z } from 'zod'

export const indicatorRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.indicator.findMany()
  }),
  getAllWithRelations: publicProcedure.query(({ ctx }) => {
    return ctx.db.indicator.findMany({
      include: {
        system: true,
        category: true,
        impacts: true,
        impactedAgents: true,
        values: {
          include: {
            company: true,
            project: true,
            oac: true,
          },
        },
      },
    })
  }),
  getIndicatorById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.indicator.findUnique({
        where: {
          id: input.id,
        },
        include: {
          values: true,
        },
      })
    }),
  getAllBySystemAndCategory: publicProcedure
    .input(z.object({ systemCode: z.string(), categoryName: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.indicator.findMany({
        where: {
          system: {
            code: input.systemCode,
          },
          category: {
            name: input.categoryName,
          },
        },
      })
    }),
  create: protectedProcedure
    .input(
      z.object({
        code: z.string(),
        system: z.string(),
        category: z.string(),
        name: z.string(),
        unit: z.string(),
        polarity: z.string(),
        cumulative: z.boolean(),
        source: z.string(),
        periodicity: z.string(),
        impacts: z.array(z.record(z.string())),
        impactedAgents: z.array(z.record(z.string())),
        equation: z.string(),
        equationDescription: z.string(),
        stratifiedByOAC: z.boolean(),
        stratifiedByRegion: z.boolean(),
        stratifiedByCompany: z.boolean(),
        stratifiedByProject: z.boolean(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.indicator.create({
        data: {
          code: input.code,
          system: {
            connect: {
              id: input.system,
            },
          },
          category: {
            connect: {
              id: input.category,
            },
          },
          name: input.name,
          unit: input.unit,
          equation: input.equation,
          equationDescription: input.equationDescription,
          polarity: input.polarity,
          cumulative: input.cumulative,
          source: input.source,
          periodicity: input.periodicity,
          impacts: {
            connect: input.impacts.map((impact) => ({
              id: impact.value,
            })),
          },
          impactedAgents: {
            connect: input.impactedAgents.map((impactedAgent) => ({
              id: impactedAgent.value,
            })),
          },
          stratifiedByOAC: input.stratifiedByOAC,
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
        system: z.string(),
        category: z.string(),
        name: z.string(),
        unit: z.string(),
        polarity: z.string(),
        cumulative: z.boolean(),
        source: z.string(),
        periodicity: z.string(),
        impacts: z.array(z.record(z.string())),
        impactedAgents: z.array(z.record(z.string())),
        equation: z.string(),
        equationDescription: z.string(),
        stratifiedByOAC: z.boolean(),
        stratifiedByRegion: z.boolean(),
        stratifiedByCompany: z.boolean(),
        stratifiedByProject: z.boolean(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.indicator.update({
        where: {
          id: input.id,
        },
        data: {
          code: input.code,
          system: {
            connect: {
              id: input.system,
            },
          },
          category: {
            connect: {
              id: input.category,
            },
          },
          name: input.name,
          unit: input.unit,
          equation: input.equation,
          equationDescription: input.equationDescription,
          polarity: input.polarity,
          cumulative: input.cumulative,
          source: input.source,
          periodicity: input.periodicity,
          impacts: {
            connect: input.impacts.map((impact) => ({
              id: impact.value,
            })),
          },
          impactedAgents: {
            connect: input.impactedAgents.map((impactedAgent) => ({
              id: impactedAgent.value,
            })),
          },
          stratifiedByOAC: input.stratifiedByOAC,
          stratifiedByRegion: input.stratifiedByRegion,
          stratifiedByCompany: input.stratifiedByCompany,
          stratifiedByProject: input.stratifiedByProject,
        },
      })
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
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
        .filter(
          (value) => !input.values.map((value) => value.id).includes(value.id),
        )
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
      return ctx.db.$transaction([
        ...deletePromises,
        ...updatePromises,
        ...createPromises,
      ])
    }),
})
