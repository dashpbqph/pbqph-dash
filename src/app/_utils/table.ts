'use client'

import { useEffect, useMemo, useState } from 'react'

type PageSizeProps = {
  usedHeight: number
  rowHeight: number
}

function getPageSize({ usedHeight, rowHeight }: PageSizeProps) {
  const availableHeight = window.innerHeight - usedHeight
  return Math.floor(availableHeight / rowHeight)
}

type UseDinamicPageSizeProps = {
  isAdmin?: boolean
  rowHeight: number
}

export function useDinamicPageSize({ isAdmin = false, rowHeight }: UseDinamicPageSizeProps) {
  const props = useMemo(
    () => ({
      usedHeight: isAdmin ? 284 : 277,
      rowHeight,
    }),
    [isAdmin, rowHeight],
  )
  const [pageSize, setPageSize] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPageSize(getPageSize(props))

      const handleResize = () => {
        setPageSize(getPageSize(props))
      }

      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [props])

  return pageSize
}
