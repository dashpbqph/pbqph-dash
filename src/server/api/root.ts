import { companyRouter } from '@/server/api/routers/company'
import { entityRouter } from '@/server/api/routers/entity'
import { indicatorRouter } from '@/server/api/routers/indicator'
import { projectRouter } from '@/server/api/routers/project'
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
  entity: entityRouter,
  project: projectRouter,
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
