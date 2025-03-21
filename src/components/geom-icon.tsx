import { cn } from '@/lib/utils'

export default function GeomIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-4 w-4', className)}
      viewBox="0 0 8 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 5.55279C8 5.93355 7.7718 6.39125 7.46667 6.54382L4.49552 8.82842C4.35426 8.93957 4.17974 9 4 9C3.82026 9 3.64574 8.93957 3.50448 8.82842L0.533334 6.54252C0.228851 6.31432 -2.74746e-07 5.85727 -3.01422e-07 5.55214L-6.67757e-07 1.36175C-7.01044e-07 0.980987 0.304482 0.752136 0.609617 0.752136L7.39038 0.752135C7.77115 0.752135 8 1.05727 8 1.36175L8 5.55279Z"
        fill="currentColor"
      />
    </svg>
  )
}
