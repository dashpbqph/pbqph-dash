import '@/styles/globals.css'

import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import { TRPCReactProvider } from '@/trpc/react'
import { clerkAppearence } from '@/utils'
import { ptBR } from '@clerk/localizations'
import { ClerkProvider } from '@clerk/nextjs'

import Navbar from '@/components/shared/navbar'
import { TailwindIndicator, ThemeProvider } from '@/components/shared/utils'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata = {
  title: 'Dashboard - PBQP-H',
  description: 'Dashboard de Indicadores - PBQP-H',
  icons: [{ rel: 'icon', url: '/favicon.png' }],
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable}`}>
        <ClerkProvider localization={ptBR} appearance={clerkAppearence}>
          <TRPCReactProvider headers={headers()}>
            <ThemeProvider
              attribute="class"
              enableSystem={false}
              disableTransitionOnChange
            >
              <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-tr from-[#005192] to-[#007577] p-6 text-white dark:bg-black dark:from-black dark:to-black">
                <div className="flex w-full flex-1 flex-col space-y-3">
                  <Navbar />
                  {children}
                </div>
              </main>
            </ThemeProvider>
          </TRPCReactProvider>
          <TailwindIndicator />
        </ClerkProvider>
      </body>
    </html>
  )
}
