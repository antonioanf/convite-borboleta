import { useEffect, useRef } from 'react'
import { useOpened } from '../../hooks/useStores'

/** Barra fina e iridescente no topo: quanto do convite já foi visto (só transform). */
export function ProgressBar() {
  const ref = useRef<HTMLDivElement>(null)
  const opened = useOpened()
  useEffect(() => {
    if (!opened) return
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const k = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      if (ref.current) ref.current.style.transform = `scaleX(${k.toFixed(4)})`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [opened])
  return <div ref={ref} className="progress" aria-hidden="true" />
}
