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
  getSecretMessage: protectedProcedure.query(({ ctx }) => {
    console.log(ctx.session)
    return 'you can now see this secret message!'
  }),
})
