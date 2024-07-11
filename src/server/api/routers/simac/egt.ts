import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { z } from 'zod'

import { isAdmin } from '@/utils/auth'

export const egtRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    if (!isAdmin(ctx.session.user.role)) throw new Error('Unauthorized')

    return ctx.db.egt.findMany()
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      if (!isAdmin(ctx.session.user.role)) throw new Error('Unauthorized')

      return ctx.db.egt.create({
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

      return ctx.db.egt.update({
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

    return ctx.db.egt.delete({
      where: {
        id: input.id,
      },
    })
  }),
})
