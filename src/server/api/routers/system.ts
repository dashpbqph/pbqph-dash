import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'

export const systemRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.system.findMany()
  }),
})
