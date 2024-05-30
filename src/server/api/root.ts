import { companyRouter } from '@/server/api/routers/company'
import { entityRouter } from '@/server/api/routers/entity'
import { guidelineRouter } from '@/server/api/routers/guideline'
import { indicatorRouter } from '@/server/api/routers/indicator'
import { projectRouter } from '@/server/api/routers/project'
import { psqRouter } from '@/server/api/routers/psq'
import { systemRouter } from '@/server/api/routers/system'
import { userRouter } from '@/server/api/routers/user'
import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc'
import { inferRouterOutputs } from '@trpc/server'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  company: companyRouter,
  indicator: indicatorRouter,
  guideline: guidelineRouter,
  entity: entityRouter,
  project: projectRouter,
  psq: psqRouter,
  system: systemRouter,
  user: userRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>
