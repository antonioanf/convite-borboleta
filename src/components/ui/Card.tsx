import { useRef, type HTMLAttributes, type PointerEvent } from 'react'
import { useHolo } from '../../lib/holo'

/**
 * Cartão do bento: fundo claro, borda de 1px translúcida, sombra colorida e um brilho
 * (spotlight) que segue o dedo — ou o mouse, no desktop.
 * `blur` liga o backdrop-filter: use em no máximo 3 elementos na página inteira.
 * `holo` liga a borda holográfica que muda de cor com a inclinação e o scroll.
 */
export function Card({
  blur = false,
  holo = false,
  className = '',
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { blur?: boolean; holo?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const spot = useRef<HTMLSpanElement>(null)
  const timer = useRef(0)
  useHolo(ref, holo)

  const move = (e: PointerEvent) => {
    const el = ref.current
    if (!el || !spot.current) return
    const r = el.getBoundingClientRect()
    spot.current.style.transform = `translate3d(${e.clientX - r.left}px, ${e.clientY - r.top}px, 0)`
  }
  const start = (e: PointerEvent) => {
    clearTimeout(timer.current)
    move(e)
    ref.current?.classList.add('is-touched')
  }
  const end = () => {
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => ref.current?.classList.remove('is-touched'), 400)
  }

  return (
    <div
      ref={ref}
      {...rest}
      className={`card ${blur ? 'card-blur' : ''} ${holo ? 'holo-border' : ''} ${className}`}
      onPointerDown={start}
      onPointerEnter={(e) => e.pointerType === 'mouse' && start(e)}
      onPointerMove={(e) => (e.pointerType === 'mouse' || ref.current?.classList.contains('is-touched')) && move(e)}
      onPointerUp={(e) => e.pointerType !== 'mouse' && end()}
      onPointerCancel={end}
      onPointerLeave={end}
    >
      <span ref={spot} className="spot" aria-hidden="true" />
      {children}
    </div>
  )
}
