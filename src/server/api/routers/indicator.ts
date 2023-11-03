import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'

export const indicatorRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.indicator.findMany()
  }),
})
