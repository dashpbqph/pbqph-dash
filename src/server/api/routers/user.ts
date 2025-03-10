import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc'
import { utapi } from '@/server/uploadthing'
import { UserRole } from '@prisma/client'
import bcrypt from 'bcrypt'
import { z } from 'zod'

import { UserEnriched } from '@/types/user'
import { isAdmin } from '@/utils/auth'

export const userRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (!isAdmin(ctx.session.user.role)) throw new Error('Unauthorized')

    const users = await ctx.db.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        role: {
          select: {
            role: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
    const usersFlat = users.map((user) => ({
      id: user.id,
      avatar: user.image,
      username: user.username,
      name: user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
      role: user.role?.role,
      company: {
        id: user.company?.id,
        name: user.company?.name,
      },
    }))

    return usersFlat as UserEnriched[]
  }),
  getUserByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          username: input.username,
        },
        include: {
          role: {
            select: {
              role: true,
            },
          },
          company: {
            select: {
              name: true,
            },
          },
        },
      })

      if (!user) throw new Error('User not found')

      return {
        avatar: user.image,
        username: user.username,
        name: user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role?.role,
        company: user.company?.name,
      }
    }),
  create: protectedProcedure
    .input(
      z.object({
        username: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
        password: z.string(),
        image: z.string(),
        companyId: z.string(),
        role: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      if (!isAdmin(ctx.session.user.role)) throw new Error('Unauthorized')

      const salt = bcrypt.genSaltSync(10)
      const hashedPassword = bcrypt.hashSync(input.password, salt)

      const userData = {
        username: input.username,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        password: hashedPassword,
        salt,
        image: input.image,
        role: {
          connect: {
            role: input.role as UserRole,
          },
        },
      }

      if (input.companyId) {
        return ctx.db.user.create({
          data: {
            ...userData,
            company: {
              connect: {
                id: input.companyId,
              },
            },
          },
        })
      }

      return ctx.db.user.create({
        data: userData,
      })
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        username: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
        image: z.string(),
        companyId: z.string(),
        role: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!isAdmin(ctx.session.user.role)) throw new Error('Unauthorized')

      const updateData: Record<string, unknown> = {
        firstName: input.firstName,
        email: input.email,
      }

      if (input.lastName) updateData.lastName = input.lastName
      if (input.image) updateData.image = input.image

      if (input.companyId) {
        return ctx.db.user.update({
          where: {
            id: input.id,
          },
          data: {
            ...updateData,
            company: {
              connect: {
                id: input.companyId,
              },
            },
          },
        })
      }

      return ctx.db.user.update({
        where: {
          username: input.username,
        },
        data: {
          ...updateData,
        },
      })
    }),
  delete: protectedProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!isAdmin(ctx.session.user.role)) throw new Error('Unauthorized')

      const deletedUser = await ctx.db.user.delete({
        where: {
          username: input.username,
        },
      })
      const imageKey = deletedUser.image?.split('/').pop()
      if (imageKey) await utapi.deleteFiles(imageKey)
    }),
  updatePassword: protectedProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      if (!isAdmin(ctx.session.user.role)) throw new Error('Unauthorized')

      const salt = bcrypt.genSaltSync(10)
      const hashedPassword = bcrypt.hashSync(input.password, salt)

      return ctx.db.user.update({
        where: {
          username: input.username,
        },
        data: {
          password: hashedPassword,
          salt,
        },
      })
    }),
})
