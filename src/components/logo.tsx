import Image from 'next/image'
import Link from 'next/link'

type LogoProps =
  | {
      variant: 'horizontal'
      color: 'color'
    }
  | {
      variant: 'icon'
      color: 'color' | 'white'
    }
  | {
      variant: 'vertical'
      color: 'white'
    }

export default function Logo({ variant = 'horizontal', color = 'color' }: LogoProps) {
  return (
    <>
      {variant === 'horizontal' && color === 'color' && (
        <Link
          href="/"
          className="relative block h-[90px] w-[90px] shrink-0 sm:h-[72px] sm:w-[280px]"
        >
          <Image
            src="/logo-color-horizontal.svg"
            placeholder="blur"
            blurDataURL="/logo.svg"
            alt="Logo"
            fill
            style={{ objectFit: 'contain' }}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            className="hidden sm:block"
          />
        </Link>
      )}
      {variant === 'vertical' && color === 'white' && (
        <Link href="/" className="relative block h-[100px] w-[150px] shrink-0">
          <Image
            src="/logo-white-vertical.svg"
            placeholder="blur"
            blurDataURL="/logo.svg"
            alt="Logo"
            fill
            style={{ objectFit: 'contain' }}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            className="hidden sm:block"
          />
        </Link>
      )}
      {variant === 'icon' && color === 'color' && (
        <Image
          src="/logo-color-icon.svg"
          placeholder="blur"
          blurDataURL="/logo.svg"
          alt="Logo"
          fill
          style={{ objectFit: 'contain' }}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
        />
      )}
    </>
  )
  // {variant === 'icon' && color === 'white' && (
  //   <Image
  //     src="/logo-white-icon-only.svg"
  //     placeholder="blur"
  //     blurDataURL="/logo.svg"
  //     alt="Logo"
  //     fill
  //     style={{ objectFit: 'contain' }}
  //     sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
  //     className="sm:hidden"
  //   />
  // )}
}
