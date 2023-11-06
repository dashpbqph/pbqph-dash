import { categoryRouter } from '@/server/api/routers/category'
import { indicatorRouter } from '@/server/api/routers/indicator'
import { systemRouter } from '@/server/api/routers/system'
import { createTRPCRouter } from '@/server/api/trpc'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  category: categoryRouter,
  indicator: indicatorRouter,
  system: systemRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
