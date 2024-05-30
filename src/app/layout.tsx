import '@/styles/globals.css'

import localFont from 'next/font/local'
import { TRPCReactProvider } from '@/trpc/react'

import { Toaster } from '@/components/ui/toaster'
import TailwindIndicator from '@/components/tailwind-indicator'
import MathProvider from '@/app/_providers/math-provider'

const fibra = localFont({
  src: [
    {
      path: '../../assets/fonts/7861255c-3d7f-4127-a537-e7f2b29016f9.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/434a9764-cd3e-4b64-9e54-3a811d9ff62c.otf',
      weight: '100',
      style: 'italic',
    },
    {
      path: '../../assets/fonts/08bfb66e-3467-49e0-bf80-fe4d8c1c53d8.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/e89089d9-5182-413f-8987-ff12dc46c8e8.otf',
      weight: '200',
      style: 'italic',
    },
    {
      path: '../../assets/fonts/eb257248-1a80-4bc6-b99f-6791dae7101c.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/cda54c97-2715-4310-8d56-aeabd5ed746b.otf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../../assets/fonts/338aaa8c-06ad-4cb2-9005-3b290f46016f.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/905c6aa6-01e1-44b6-905d-8e1c70a7e7de.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../assets/fonts/e8738805-ad7c-40db-8435-58768bf70976.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/05f15479-35ba-4cb4-8b88-03acdd3cc6ed.otf',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../../assets/fonts/e95fd454-8470-4d97-8f0f-d1c8d4ad1265.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/4ff69b0e-bbb6-4399-a217-7800fcea2e66.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../../assets/fonts/36f9fae0-db3e-4dad-8ca9-79c496697e29.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/681bde69-f253-443f-b031-321a66618da0.otf',
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
          <TRPCReactProvider>
            <MathProvider>{children}</MathProvider>
          </TRPCReactProvider>
        </main>
        <Toaster />
        <TailwindIndicator />
      </body>
    </html>
  )
}
