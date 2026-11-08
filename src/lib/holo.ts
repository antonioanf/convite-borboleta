/**
 * Brilho holográfico: o ângulo do gradiente (--holo-a) muda com a inclinação do celular e com o scroll.
 * Só os elementos registrados (data-holo) recebem a variável — nada de recalcular a página inteira.
 * Chamado a cada frame pelo EffectsLayer; só escreve quando o ângulo muda de verdade.
 */
import { useEffect, type RefObject } from 'react'
import { tilt } from './tilt'

const els = new Set<HTMLElement>()
let last = Infinity

export function updateHolo() {
  if (!els.size) return
  const a = tilt.x * 55 + tilt.y * 30 + window.scrollY * 0.09
  if (Math.abs(a - last) < 0.8) return
  last = a
  const v = `${a.toFixed(1)}deg`
  els.forEach((el) => el.style.setProperty('--holo-a', v))
}

export function useHolo(ref: RefObject<HTMLElement | null>, on = true) {
  useEffect(() => {
    const el = ref.current
    if (!el || !on) return
    els.add(el)
    last = Infinity
    return () => {
      els.delete(el)
    }
  }, [ref, on])
}
