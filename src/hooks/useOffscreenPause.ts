import { useEffect, type RefObject } from 'react'

/** Pausa animações CSS de uma seção enquanto ela está fora da tela. */
export function useOffscreenPause(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([e]) => el.classList.toggle('is-offscreen', !e.isIntersecting),
      { rootMargin: '120px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
}
