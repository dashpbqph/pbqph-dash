import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { z } from 'zod'

import { isAdmin } from '@/utils/auth'

export const itaRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    if (!isAdmin(ctx.session.user.role)) throw new Error('Unauthorized')

    return ctx.db.ita.findMany()
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      if (!isAdmin(ctx.session.user.role)) throw new Error('Unauthorized')

      return ctx.db.ita.create({
        data: {
          name: input.name,
        },
      })
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      if (!isAdmin(ctx.session.user.role)) throw new Error('Unauthorized')

      return ctx.db.ita.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      })
    }),
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ ctx, input }) => {
    if (!isAdmin(ctx.session.user.role)) throw new Error('Unauthorized')

    return ctx.db.ita.delete({
      where: {
        id: input.id,
      },
    })
  }),
})
