import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc'
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
        values: true,
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
        },
      })
    }),
})
