import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes('YOUR_MYSQL_URL_HERE'),
        'You forgot to change the default database URL',
      ),
    OPENAI_API_KEY: z
      .string()
      .refine(
        (str) => !str.includes('YOUR_OPENAI_API_KEY_HERE'),
        'You forgot to change the default openai api key',
      ),
    UPLOADTHING_SECRET: z
      .string()
      .refine(
        (str) => !str.includes('YOUR_UPLOADTHING_SECRET_HERE'),
        'You forgot to change the default uploadthing secret',
      ),
    UPLOADTHING_APP_ID: z
      .string()
      .refine(
        (str) => !str.includes('YOUR_UPLOADTHING_APP_ID_HERE'),
        'You forgot to change the default uploadthing app id',
      ),
    NEXTAUTH_SECRET: z
      .string()
      .refine(
        (str) => !str.includes('YOUR_NEXTAUTH_SECRET_HERE'),
        'You forgot to change the default auth secret',
      ),
    NODE_ENV: z
      .enum(['development', 'staging', 'production'])
      .default('development'),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {},

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
})
