import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc'
import { z } from 'zod'

export const entityRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
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
  getAllOACs: publicProcedure.query(({ ctx }) => {
    return ctx.db.oac.findMany()
  }),
  getAllPSQS: publicProcedure.query(({ ctx }) => {
    return ctx.db.psq.findMany()
  }),
  getAllGuidelines: publicProcedure.query(({ ctx }) => {
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
      return ctx.db.oac.create({
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
      return ctx.db.oac.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      })
    }),
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ ctx, input }) => {
    return ctx.db.oac.delete({
      where: {
        id: input.id,
      },
    })
  }),
})
