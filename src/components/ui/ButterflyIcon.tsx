import { FOREWING, HINDWING } from '../../lib/butterflySvg'
import { useId } from 'react'

/** Borboleta vetorial (ícone/decoração) com batida de asas em CSS. */
export function ButterflyIcon({
  size = 32,
  flap = true,
  speed = 0.5,
  className = '',
  style,
}: {
  size?: number
  flap?: boolean
  speed?: number
  className?: string
  style?: React.CSSProperties
}) {
  const id = useId().replace(/:/g, '')
  const wing = (
    <>
      <path d={FOREWING} fill={`url(#f${id})`} stroke="var(--color-dourado)" strokeWidth="1.2" strokeOpacity=".8" />
      <path d={HINDWING} fill={`url(#h${id})`} stroke="var(--color-dourado)" strokeWidth="1" strokeOpacity=".6" />
      <circle cx="36" cy="-26" r="3.4" fill="#fff" fillOpacity=".85" />
      <circle cx="27" cy="-17" r="2" fill="var(--color-dourado)" />
    </>
  )
  const anim = flap ? { animationDuration: `${speed}s` } : { animation: 'none' }
  return (
    <svg
      width={size}
      height={size}
      viewBox="-52 -48 104 96"
      className={`bfly-icon ${className}`}
      style={{ overflow: 'visible', ...style }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`f${id}`} x1="0" y1="0" x2="1" y2="-1">
          <stop offset="0" stopColor="var(--color-violeta)" />
          <stop offset="1" stopColor="var(--color-rosa)" />
        </linearGradient>
        <linearGradient id={`h${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-violeta-claro)" />
          <stop offset="1" stopColor="var(--color-lilas)" />
        </linearGradient>
      </defs>
      <g className="wr" style={anim}>{wing}</g>
      <g className="wl" style={anim}>
        <g transform="scale(-1,1)">{wing}</g>
      </g>
      <ellipse cx="0" cy="2" rx="2.6" ry="16" fill="#2a1145" />
      <path d="M-1,-13 Q-6,-26 -10,-30 M1,-13 Q6,-26 10,-30" stroke="#2a1145" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  )
}
