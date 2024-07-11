import { indicatorRouter } from '@/server/api/routers/indicator'
import { companyRouter, oacRouter, projectRouter } from '@/server/api/routers/siac'
import { egtRouter, emRouter, psqRouter } from '@/server/api/routers/simac'
import { datecRouter, fadRouter, guidelineRouter, itaRouter } from '@/server/api/routers/sinat'
import { userRouter } from '@/server/api/routers/user'
import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc'
import { inferRouterOutputs } from '@trpc/server'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  indicator: indicatorRouter,
  // siac
  oac: oacRouter,
  company: companyRouter,
  project: projectRouter,
  // simac
  egt: egtRouter,
  em: emRouter,
  psq: psqRouter,
  // sinat
  ita: itaRouter,
  fad: fadRouter,
  guideline: guidelineRouter,
  datec: datecRouter,
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
