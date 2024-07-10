import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { z } from 'zod'

import { isAdmin } from '@/utils/auth'

export const companyRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ company: z.string().optional() }))
    .query(({ ctx, input }) => {
      if (!input.company && !isAdmin(ctx.session.user.role)) throw new Error('Unauthorized')

      if (input.company) {
        return ctx.db.company.findMany({
          where: {
            id: input.company,
          },
        })
      }

      return ctx.db.company.findMany({
        include: {
          projects: true,
        },
      })
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      if (!isAdmin(ctx.session.user.role)) throw new Error('Unauthorized')

      return ctx.db.company.create({
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

      return ctx.db.company.update({
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

    return ctx.db.company.delete({
      where: {
        id: input.id,
      },
    })
  }),
})
