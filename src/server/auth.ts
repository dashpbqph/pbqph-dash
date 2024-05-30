import { db } from '@/server/db'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { UserRole } from '@prisma/client'
import bcrypt from 'bcrypt'
import { getServerSession, type DefaultSession, type NextAuthOptions } from 'next-auth'
import { type Adapter } from 'next-auth/adapters'
import CredentialsProvider from 'next-auth/providers/credentials'

import { loginSchema } from './validation/auth'

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      username: string
      role: UserRole
    } & DefaultSession['user']
  }

  interface User {
    id: string
    username: string
    role: UserRole
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 }, // session expires in 1 day
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.role = user.role
        token.name = user.name
        token.email = user.email
        token.image = user.image
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.username = token.username as string
      session.user.role = token.role as UserRole
      session.user.name = token.name as string
      session.user.email = token.email as string
      return session
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const res = await loginSchema.safeParseAsync(credentials)
        if (!res.success) throw new Error('Invalid Credentials')
        const cred = res.data

        const user = await db.user.findUnique({
          where: { username: cred.username },
          include: { role: true },
        })
        console.log('user', user)

        if (!user) throw new Error('Invalid Credentials')

        const isValidPassword = await bcrypt.compare(cred.password, user.password)
        if (!isValidPassword) throw new Error('Invalid Credentials')

        return {
          id: user.id,
          username: user.username,
          role: user.role?.role,
          name: user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName,
          email: user.email,
          image: user.image,
        }
      },
    }),
  ],
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions)
