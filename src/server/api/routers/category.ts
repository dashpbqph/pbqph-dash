import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { z } from 'zod'

export const categoryRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.category.findMany()
  }),
  getAllBySystem: publicProcedure
    .input(z.object({ systemCode: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.category.findMany({
        where: {
          systems: {
            some: {
              code: input.systemCode,
            },
          },
        },
      })
    }),
})
