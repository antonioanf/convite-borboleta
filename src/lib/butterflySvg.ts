// Desenho vetorial da borboleta (usado nas revoadas DOM, no favicon e nos ícones).
// Corpo em x=0; viewBox -52 -48 104 96. A asa esquerda é o espelho da direita.
import { convite } from '../config/convite'

export const FOREWING =
  'M2,-5 C8,-28 28,-46 46,-42 C56,-39 55,-22 44,-11 C34,-3 16,-2 2,-2 Z'
export const HINDWING =
  'M2,0 C14,1 32,5 39,17 C45,29 35,42 23,38 C13,35 6,22 2,6 Z'

let uid = 0

/** Gera o SVG de uma borboleta (string) com cores da paleta e variação de matiz. */
export function butterflySvg(size = 40, variant = 0): string {
  const p = convite.paleta
  const id = `b${uid++}`
  const a = variant % 3 === 0 ? p.lilas : variant % 3 === 1 ? p.rosa : p.lilas
  const b = variant % 3 === 0 ? p.rosa : variant % 3 === 1 ? p.violeta : p.lilas
  const wing = `
    <path d="${FOREWING}" fill="url(#${id}f)" stroke="${p.prata}" stroke-width="1.2" stroke-opacity=".8"/>
    <path d="${HINDWING}" fill="url(#${id}h)" stroke="${p.prata}" stroke-width="1" stroke-opacity=".6"/>
    <circle cx="36" cy="-26" r="3.4" fill="#fff" fill-opacity=".85"/>
    <circle cx="27" cy="-17" r="2" fill="${p.prata}"/>
    <circle cx="26" cy="22" r="3" fill="#fff" fill-opacity=".6"/>`
  return `<svg class="bfly" width="${size}" height="${size}" viewBox="-52 -48 104 96" aria-hidden="true">
    <defs>
      <linearGradient id="${id}f" x1="0" y1="0" x2="1" y2="-1"><stop offset="0" stop-color="${b}"/><stop offset="1" stop-color="${a}"/></linearGradient>
      <linearGradient id="${id}h" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${b}"/><stop offset="1" stop-color="${p.lilas}"/></linearGradient>
    </defs>
    <g class="wr">${wing}</g>
    <g class="wl"><g transform="scale(-1,1)">${wing}</g></g>
    <ellipse cx="0" cy="2" rx="2.6" ry="16" fill="#2a1145"/>
    <path d="M-1,-13 Q-6,-26 -10,-30 M1,-13 Q6,-26 10,-30" stroke="#2a1145" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  </svg>`
}

export function prefersReducedMotion() {
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Revoada de borboletas em DOM (leve, funciona sem a cena 3D).
 * `towardCamera` = crescem como se viessem na direção da tela.
 */
export function butterflyBurst(opts: {
  x: number
  y: number
  count?: number
  container?: HTMLElement
  towardCamera?: boolean
  spread?: number
}) {
  if (prefersReducedMotion()) return
  const { x, y, count = 12, container = document.body, towardCamera = false, spread = 1 } = opts
  const layer = document.createElement('div')
  layer.setAttribute('aria-hidden', 'true')
  layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:120;overflow:hidden'
  container.appendChild(layer)
  const w = window.innerWidth
  const h = window.innerHeight
  let done = 0
  for (let i = 0; i < count; i++) {
    const tmp = document.createElement('div')
    const size = towardCamera ? 30 + Math.random() * 20 : 22 + Math.random() * 16
    tmp.innerHTML = butterflySvg(size, i)
    const el = tmp.firstElementChild as SVGElement
    layer.appendChild(el)
    const ang = (i / count) * Math.PI * 2 + Math.random() * 0.6
    const dist = (towardCamera ? Math.max(w, h) * 0.75 : 140 + Math.random() * 120) * spread
    const dx = Math.cos(ang) * dist
    const dy = Math.sin(ang) * dist - (towardCamera ? 0 : 80)
    const endScale = towardCamera ? 3 + Math.random() * 3.5 : 0.8 + Math.random() * 0.5
    const rot = (ang * 180) / Math.PI + 90
    const sx = x - size / 2
    const sy = y - size / 2
    const flapDur = 0.12 + Math.random() * 0.1
    el.querySelectorAll<SVGGElement>('.wl,.wr').forEach((g) => (g.style.animationDuration = `${flapDur}s`))
    const anim = el.animate(
      [
        { transform: `translate(${sx}px,${sy}px) rotate(${rot}deg) scale(.15)`, opacity: 0 },
        { transform: `translate(${sx + dx * 0.25}px,${sy + dy * 0.25}px) rotate(${rot}deg) scale(${towardCamera ? 1 : 0.9})`, opacity: 1, offset: 0.2 },
        { transform: `translate(${sx + dx}px,${sy + dy}px) rotate(${rot + (Math.random() - 0.5) * 60}deg) scale(${endScale})`, opacity: 0 },
      ],
      {
        duration: (towardCamera ? 1300 : 1500) + Math.random() * 500,
        delay: Math.random() * 180,
        easing: 'cubic-bezier(.2,.7,.3,1)',
        fill: 'both',
      },
    )
    anim.onfinish = () => {
      el.remove()
      if (++done === count) layer.remove()
    }
  }
  // segurança: remove a camada mesmo se algo falhar
  setTimeout(() => layer.remove(), 3000)
}
