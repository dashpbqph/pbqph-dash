import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'

export const guidelineRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.guideline.findMany()
  }),
})
