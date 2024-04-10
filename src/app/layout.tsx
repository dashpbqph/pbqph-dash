import '@/styles/globals.css'

import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import { MathProvider } from '@/providers'
import { TRPCReactProvider } from '@/trpc/react'

import { Navbar } from '@/components/shared/navbar'
import { TailwindIndicator } from '@/components/shared/utils'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata = {
  title: 'Dashboard - PBQP-H',
  description: 'Dashboard de Indicadores - PBQP-H',
  icons: [{ rel: 'icon', url: '/favicon.png' }],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider headers={headers()}>
          <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-tr from-[#005192] to-[#007577] p-3 text-white dark:bg-black dark:from-black dark:to-black sm:p-6">
            <div className="flex w-full flex-1 flex-col space-y-3">
              <Navbar />
              <MathProvider>{children}</MathProvider>
            </div>
          </main>
        </TRPCReactProvider>
        <Toaster />
        <TailwindIndicator />
      </body>
    </html>
  )
}
