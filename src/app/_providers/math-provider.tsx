'use client'

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

export default function MathProvider({ children }: { children: React.ReactNode }) {
  return (
    <MathJaxContext version={3} config={config} hideUntilTypeset="every">
      {children}
    </MathJaxContext>
  )
}
