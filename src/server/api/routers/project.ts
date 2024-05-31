import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc'
import { z } from 'zod'

export const projectRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.project.findMany()
  }),
  getAllWithRelations: publicProcedure.query(({ ctx }) => {
    return ctx.db.project.findMany({
      include: {
        company: true,
      },
    })
  }),
  create: publicProcedure
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
  update: publicProcedure
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
