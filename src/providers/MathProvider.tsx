'use client'

import { ReactNode } from 'react'
import { MathJaxContext } from 'better-react-mathjax'

const config = {
  'fast-preview': {
    disabled: true,
  },
  tex2jax: {
    inlineMath: [
      ['$', '$'],
      ['\\(', '\\)'],
    ],
    displayMath: [
      ['$$', '$$'],
      ['\\[', '\\]'],
    ],
  },
  messageStyle: 'none',
}

export default function MathProvider({ children }: { children: ReactNode }) {
  return (
    <MathJaxContext
      version={2}
      config={config}
      onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
    >
      {children}
    </MathJaxContext>
  )
}
