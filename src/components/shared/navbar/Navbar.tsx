'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import Tabs from '@/components/shared/tabs'
import { AuthButton } from '@/components/shared/user'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center justify-between">
      {/* Logo */}
      <Link
        href="/"
        className="relative block h-[90px] w-[90px] shrink-0 sm:h-[70px] sm:w-[280px]"
      >
        <Image
          src="/logo.svg"
          alt="Logo"
          fill
          style={{ objectFit: 'contain' }}
          className="hidden sm:block"
          priority
        />
        <Image
          src="/logo-icon-only.svg"
          alt="Logo"
          fill
          style={{ objectFit: 'contain' }}
          className="sm:hidden"
          priority
        />
      </Link>
      <div className="flex flex-col items-end space-y-2">
        {/* Theme & Auth Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            className="w-9 px-0"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <AuthButton />
        </div>
        {/* Tabs */}
        <Tabs />
      </div>
    </div>
  )
}
