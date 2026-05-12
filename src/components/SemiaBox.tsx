import type { ReactNode, CSSProperties } from 'react'

interface Props {
  children: ReactNode
  style?: CSSProperties
}

export default function SemiaBox({ children, style }: Props) {
  return (
    <div
      data-semia-box="1"
      style={{
        border: '1px solid #0f0e0b',
        borderRadius: 0,
        background: 'rgba(245, 243, 238, 0.91)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        position: 'relative',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
