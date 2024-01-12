import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'

export const projectRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.project.findMany()
  }),
})
