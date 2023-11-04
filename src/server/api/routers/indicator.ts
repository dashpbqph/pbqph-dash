import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc'

export const indicatorRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.indicator.findMany()
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return 'you can now see this secret message!'
  }),
})
