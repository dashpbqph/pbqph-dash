import { categoryRouter } from '@/server/api/routers/category'
import { companyRouter } from '@/server/api/routers/company'
import { indicatorRouter } from '@/server/api/routers/indicator'
import { projectRouter } from '@/server/api/routers/project'
import { systemRouter } from '@/server/api/routers/system'
import { userRouter } from '@/server/api/routers/user'
import { createTRPCRouter } from '@/server/api/trpc'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  category: categoryRouter,
  company: companyRouter,
  indicator: indicatorRouter,
  project: projectRouter,
  system: systemRouter,
  user: userRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
