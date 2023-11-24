import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { UserRole } from '@prisma/client'
import bcrypt from 'bcrypt'
import { UTApi } from 'uploadthing/server'
import { z } from 'zod'

export const utapi = new UTApi()

export type UserEnriched = {
  avatar: string
  username: string
  name: string
  firstName: string
  lastName: string
  email: string
  createdAt: Date
  role: UserRole
}

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
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
      },
    })
    const usersFlat = users.map((user) => ({
      avatar: user.image,
      username: user.username,
      name: user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.firstName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
      role: user.role?.role,
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
        },
      })

      if (!user) return null

      return {
        avatar: user.image,
        username: user.username,
        name: user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.firstName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role?.role,
      }
    }),
  create: publicProcedure
    .input(
      z.object({
        username: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
        password: z.string(),
        image: z.string(),
        role: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const salt = bcrypt.genSaltSync(10)
      const hashedPassword = bcrypt.hashSync(input.password, salt)

      return ctx.db.user.create({
        data: {
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
        },
      })
    }),
  updateSelf: publicProcedure
    .input(
      z.object({
        username: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
        password: z.string(),
        image: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const updateData: Record<string, unknown> = {
        firstName: input.firstName,
        email: input.email,
      }

      if (input.lastName) updateData.lastName = input.lastName
      if (input.password) {
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(input.password, salt)
        updateData.password = hashedPassword
        updateData.salt = salt
      }
      if (input.image) updateData.image = input.image

      return ctx.db.user.update({
        where: {
          username: input.username,
        },
        data: updateData,
      })
    }),
  updateImage: publicProcedure
    .input(
      z.object({
        username: z.string(),
        image: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.db.user.update({
        where: {
          username: input.username,
        },
        data: {
          image: input.image,
        },
      })
      const imageKey = updatedUser.image?.split('/').pop()
      if (imageKey) await utapi.deleteFiles(imageKey)
    }),
  delete: publicProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const deletedUser = await ctx.db.user.delete({
        where: {
          username: input.username,
        },
      })
      const imageKey = deletedUser.image?.split('/').pop()
      if (imageKey) await utapi.deleteFiles(imageKey)
    }),
  updatePassword: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
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
