import '@/styles/globals.css'

import localFont from 'next/font/local'
import { TRPCReactProvider } from '@/trpc/react'

import { Toaster } from '@/components/ui/toaster'
import TailwindIndicator from '@/components/tailwind-indicator'
import AuthProvider from '@/app/_providers/auth'
import JotaiProvider from '@/app/_providers/jotai'

const fibra = localFont({
  src: [
    {
      path: '../../assets/fonts/fibra-thin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/fibra-thin-it.otf',
      weight: '100',
      style: 'italic',
    },
    {
      path: '../../assets/fonts/fibra-ultralight.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/fibra-ultralight-it.otf',
      weight: '200',
      style: 'italic',
    },
    {
      path: '../../assets/fonts/fibra-light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/fibra-light-it.otf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../../assets/fonts/fibra-regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/fibra-regular-it.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../assets/fonts/fibra-semibold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/fibra-semibold-it.otf',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../../assets/fonts/fibra-bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/fibra-bold-it.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../../assets/fonts/fibra-ultrabold.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/fibra-ultrabold-it.otf',
      weight: '800',
      style: 'italic',
    },
  ],
  variable: '--font-fibra',
})

export const metadata = {
  title: 'Dashboard PBQP-H',
  description: 'Dashboard de Indicadores - PBQP-H',
  icons: [{ rel: 'icon', url: '/favicon.png' }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`antialiased ${fibra.variable}`}>
      <body>
        <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-2 text-white dark:bg-black dark:from-black dark:to-black sm:p-3">
          <AuthProvider>
            <JotaiProvider>
              <TRPCReactProvider>{children}</TRPCReactProvider>
            </JotaiProvider>
          </AuthProvider>
        </main>
        <Toaster />
        <TailwindIndicator />
      </body>
    </html>
  )
}
