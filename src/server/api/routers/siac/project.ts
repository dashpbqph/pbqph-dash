import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { z } from 'zod'

import { isAdmin } from '@/utils/auth'

export const projectRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ company: z.string().optional() }))
    .query(({ ctx, input }) => {
      if (!input.company && !isAdmin(ctx.session.user.role)) throw new Error('Unauthorized')

      if (input.company) {
        return ctx.db.project.findMany({
          where: {
            companyId: input.company,
          },
          include: {
            company: true,
          },
        })
      }

      return ctx.db.project.findMany({
        include: {
          company: true,
        },
      })
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        companyId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.project.create({
        data: {
          name: input.name,
          company: {
            connect: {
              id: input.companyId,
            },
          },
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
      return ctx.db.project.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      })
    }),
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ ctx, input }) => {
    return ctx.db.project.delete({
      where: {
        id: input.id,
      },
    })
  }),
})
