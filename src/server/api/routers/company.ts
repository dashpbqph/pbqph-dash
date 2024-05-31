import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc'
import { z } from 'zod'

export const companyRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.company.findMany()
  }),
  getAllWithProjects: publicProcedure.query(({ ctx }) => {
    return ctx.db.company.findMany({
      include: {
        projects: true,
      },
    })
  }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.company.create({
        data: {
          name: input.name,
        },
      })
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
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
    return ctx.db.company.delete({
      where: {
        id: input.id,
      },
    })
  }),
})
