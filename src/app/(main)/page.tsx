export default function Home() {
  return (
    <div className="flex w-full flex-1 flex-col space-y-3">
      <div className="flex h-44 w-full space-x-3">
        <div className="w-1/2 rounded-md bg-white sm:w-1/4" />
        <div className="w-1/2 rounded-md bg-white sm:w-1/4" />
        <div className="hidden w-1/2 rounded-md bg-white sm:block sm:w-1/4" />
        <div className="hidden w-1/2 rounded-md bg-white sm:block sm:w-1/4" />
      </div>
      <div className="w-full flex-1 rounded-md bg-white" />
    </div>
  )
}
