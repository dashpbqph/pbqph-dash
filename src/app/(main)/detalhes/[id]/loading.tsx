import { Separator } from '@/components/ui/separator'

export default function loading() {
  return (
    <div className="flex w-full flex-1 flex-col gap-3 rounded-md bg-white p-6 text-black">
      <div className="flex animate-pulse flex-col gap-3">
        <div className="h-8 rounded-md bg-gray-300" />
        <div className="h-8 rounded-md bg-gray-300" />
        <div className="h-8 rounded-md bg-gray-200" />
        <div className="h-8 rounded-md bg-gray-200" />
      </div>
      <div className="flex animate-pulse gap-3">
        <div className="flex-1 rounded-md bg-gray-300" />
        <Separator orientation="vertical" className="h-8" />
        <div className="flex-1 rounded-md bg-gray-300" />
        <Separator orientation="vertical" className="h-8" />
        <div className="flex-1 rounded-md bg-gray-300" />
        <Separator orientation="vertical" className="h-8" />
        <div className="flex-1 rounded-md bg-gray-300" />
        <Separator orientation="vertical" className="h-8" />
        <div className="flex-1 rounded-md bg-gray-300" />
        <Separator orientation="vertical" className="h-8" />
        <div className="flex-1 rounded-md bg-gray-300" />
      </div>
      <Separator />
      <div className="flex flex-1 animate-pulse gap-4">
        <div className="flex w-[260px] animate-pulse flex-col gap-4">
          <div className="flex-1 rounded-md bg-gray-300" />
          <div className="flex-1 rounded-md bg-gray-300" />
          <div className="flex-1 rounded-md bg-gray-300" />
          <div className="flex-1 rounded-md bg-gray-300" />
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex-1 rounded-md bg-gray-300" />
        </div>
      </div>
    </div>
  )
}
