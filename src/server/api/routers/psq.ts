import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'

export const psqRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.psq.findMany()
  }),
})
