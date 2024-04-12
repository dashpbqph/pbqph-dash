import { getServerAuthSession } from '@/server/auth'

export default async function Home() {
  const session = await getServerAuthSession()
  console.log('session', session)

  return <div className="flex-1 rounded-xl bg-gray-200"></div>
}
