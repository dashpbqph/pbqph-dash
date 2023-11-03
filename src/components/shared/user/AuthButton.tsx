import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

import { Button } from '@/components/ui/button'

export default function AuthButton() {
  return (
    <>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button variant="ghost" className="text-md">
            Entrar
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  )
}
