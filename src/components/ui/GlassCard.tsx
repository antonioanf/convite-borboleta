import { useRef, type HTMLAttributes, type PointerEvent } from 'react'

/**
 * Card de vidro: fundo translúcido, borda fina iluminada e um brilho que
 * acompanha o dedo enquanto o card está sendo tocado.
 * `blur` liga o backdrop-filter — use em no máximo 2–3 cards visíveis ao mesmo tempo.
 */
export function GlassCard({
  blur = false,
  className = '',
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { blur?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const glow = useRef<HTMLSpanElement>(null)
  const timer = useRef<number>(0)

  const move = (e: PointerEvent) => {
    const el = ref.current
    if (!el || !glow.current) return
    const r = el.getBoundingClientRect()
    glow.current.style.transform = `translate3d(${e.clientX - r.left}px, ${e.clientY - r.top}px, 0)`
  }
  const start = (e: PointerEvent) => {
    clearTimeout(timer.current)
    move(e)
    ref.current?.classList.add('is-touched')
  }
  const end = () => {
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => ref.current?.classList.remove('is-touched'), 450)
  }

  return (
    <div
      ref={ref}
      {...rest}
      className={`glass ${blur ? 'glass-blur' : ''} ${className}`}
      onPointerDown={start}
      onPointerMove={(e) => ref.current?.classList.contains('is-touched') && move(e)}
      onPointerUp={end}
      onPointerCancel={end}
      onPointerLeave={end}
    >
      <span ref={glow} className="touch-glow" aria-hidden="true" />
      {children}
    </div>
  )
}
