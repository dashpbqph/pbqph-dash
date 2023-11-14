import { utapi } from '@/server/api/routers/user'
import { getServerAuthSession } from '@/server/auth'
import { db } from '@/server/db'
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { z } from 'zod'

const f = createUploadthing()

export const fileRouter = {
  imageUploader: f(['image'])
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .middleware(async ({ input }) => {
      const session = await getServerAuthSession()
      if (!session) throw new Error('Unauthorized')
      return { username: input.username }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const oldUser = await db.user.findUnique({
        where: { username: metadata.username },
      })
      await db.user.update({
        where: { username: metadata.username },
        data: { image: file.url },
      })
      const imageKey = oldUser?.image?.split('/').pop()
      if (imageKey) await utapi.deleteFiles(imageKey)
    }),
} satisfies FileRouter

export type OurFileRouter = typeof fileRouter
