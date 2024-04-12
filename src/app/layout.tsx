import '@/styles/globals.css'

import { Inter } from 'next/font/google'
import { TRPCReactProvider } from '@/trpc/react'

import { Toaster } from '@/components/ui/toaster'
import Navbar from '@/app/_components/navbar'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata = {
  title: 'Dashboard - PBQP-H',
  description: 'Dashboard de Indicadores - PBQP-H',
  icons: [{ rel: 'icon', url: '/favicon.png' }],
}

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans antialiased ${inter.variable}`}>
        <TRPCReactProvider>
          <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-tr from-[#005192] to-[#007577] p-3 text-white dark:bg-black dark:from-black dark:to-black sm:p-6">
            <div className="flex w-full flex-1 flex-col space-y-3">
              <Navbar />
              {children}
            </div>
          </main>
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  )
}
