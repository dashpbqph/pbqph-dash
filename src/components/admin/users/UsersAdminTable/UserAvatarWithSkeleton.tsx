import Image from 'next/image'

type AvatarWithSkeletonProps = {
  src?: string
}

export default function AvatarWithSkeleton({ src }: AvatarWithSkeletonProps) {
  return (
    <div className="relative h-[40px] w-[40px]">
      <Image
        src={src || '/avatar-placeholder.png'}
        className="border-0.5 h-[40px] w-[40px] rounded-full border bg-gray-200 data-[loading=true]:animate-pulse"
        alt=""
        width={40}
        height={40}
        data-loading={!src}
      />
    </div>
  )
}
