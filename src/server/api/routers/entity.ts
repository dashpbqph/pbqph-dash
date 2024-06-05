import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { z } from 'zod'

export const entityRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const [oacs, psqs, guidelines] = await Promise.all([
      ctx.db.oac.findMany(),
      ctx.db.psq.findMany(),
      ctx.db.guideline.findMany(),
    ])

    return [
      ...oacs.map((oac) => ({ ...oac, type: 'oac' })),
      ...psqs.map((psq) => ({ ...psq, type: 'psq' })),
      ...guidelines.map((guideline) => ({ ...guideline, type: 'guideline' })),
    ]
  }),
  getAllOACs: protectedProcedure.query(({ ctx }) => {
    return ctx.db.oac.findMany()
  }),
  getAllPSQS: protectedProcedure.query(({ ctx }) => {
    return ctx.db.psq.findMany()
  }),
  getAllGuidelines: protectedProcedure.query(({ ctx }) => {
    return ctx.db.guideline.findMany()
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      if (input.type === 'oac') {
        return ctx.db.oac.create({
          data: {
            name: input.name,
          },
        })
      }

      if (input.type === 'psq') {
        return ctx.db.oac.create({
          data: {
            name: input.name,
          },
        })
      }

      // input.type === 'guideline'
      return ctx.db.guideline.create({
        data: {
          name: input.name,
        },
      })
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.string(),
        name: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      if (input.type === 'oac') {
        return ctx.db.oac.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
          },
        })
      }

      if (input.type === 'psq') {
        return ctx.db.psq.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
          },
        })
      }

      // input.type === 'guideline'
      return ctx.db.guideline.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      })
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string(), type: z.string() }))
    .mutation(({ ctx, input }) => {
      if (input.type === 'oac') {
        return ctx.db.oac.delete({
          where: {
            id: input.id,
          },
        })
      }

      if (input.type === 'psq') {
        return ctx.db.psq.delete({
          where: {
            id: input.id,
          },
        })
      }

      // input.type === 'guideline'
      return ctx.db.guideline.delete({
        where: {
          id: input.id,
        },
      })
    }),
})
