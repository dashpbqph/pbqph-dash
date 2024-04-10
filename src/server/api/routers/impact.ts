import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'

export const impactRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.impact.findMany()
  }),
})
