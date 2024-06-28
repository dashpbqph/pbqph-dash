import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'

import 'katex/dist/katex.min.css' // `rehype-katex` does not import the CSS for you

import { cn } from '@/lib/utils'

export default function Markdown({
  className,
  children,
}: {
  className?: string
  children: string
}) {
  return (
    <ReactMarkdown
      className={cn('prose', className)}
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
    >
      {children}
    </ReactMarkdown>
  )
}
