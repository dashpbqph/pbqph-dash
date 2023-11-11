import {
  AuthButton,
  Logo,
  Tabs,
  ThemeSwitchButton,
} from '@/components/shared/navbar'

export default function Navbar() {
  return (
    <div className="flex items-center justify-between">
      <Logo />
      <div className="flex flex-col items-end space-y-2">
        <div className="flex items-center space-x-4">
          <ThemeSwitchButton />
          <AuthButton />
        </div>
        <Tabs />
      </div>
    </div>
  )
}
