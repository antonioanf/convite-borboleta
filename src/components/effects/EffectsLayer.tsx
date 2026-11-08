import { useEffect, useRef } from 'react'
import { field, type Butterfly } from '../../lib/butterflyField'
import { WING, WINGSPAN_UNITS, wingCanvas } from '../../lib/wingArt'
import { tilt, updateTilt } from '../../lib/tilt'
import { perf } from '../../lib/perf'
import { convite } from '../../config/convite'

/** Estado compartilhado: quando a cena 3D está desenhando, o 2D não desenha borboletas. */
export const renderState = { threeReady: false }

interface Dust {
  x: number
  y: number
  vy: number
  r: number
  tw: number
  ph: number
  c: number
  depth: number
}

function glowSprite(color: string) {
  const c = document.createElement('canvas')
  c.width = c.height = 32
  const g = c.getContext('2d')!
  const rg = g.createRadialGradient(16, 16, 0, 16, 16, 16)
  rg.addColorStop(0, '#ffffff')
  rg.addColorStop(0.2, color)
  rg.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = rg
  g.fillRect(0, 0, 32, 32)
  return c
}

function drawButterfly(ctx: CanvasRenderingContext2D, b: Butterfly, ox: number, oy: number) {
  const img = wingCanvas(b.variant)
  const depth = 1 + b.z * 0.18
  const s = (b.size * depth) / WINGSPAN_UNITS
  const x = b.x + ox * (0.6 + b.z * 0.4)
  const y = b.y + oy * (0.6 + b.z * 0.4)
  // abertura das asas: cos do ângulo simula a rotação no eixo do corpo
  const f = Math.max(0.1, Math.cos(b.wing * Math.PI * 0.47))
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(b.heading + Math.PI / 2)
  ctx.scale(s, s)
  const w = WING.W / WING.S
  const h = WING.H / WING.S
  const ox0 = -WING.OX / WING.S
  const oy0 = -WING.OY / WING.S
  ctx.save()
  ctx.scale(f, 1)
  ctx.drawImage(img, ox0, oy0, w, h)
  ctx.restore()
  ctx.save()
  ctx.scale(-f, 1)
  ctx.drawImage(img, ox0, oy0, w, h)
  ctx.restore()
  ctx.fillStyle = '#2a1145'
  ctx.beginPath()
  ctx.ellipse(0, 2, 2.8, 16, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

/**
 * Canvas 2D fixo por cima do conteúdo:
 *  - pó de fada dourado flutuando
 *  - rastro de brilhos do dedo
 *  - borboletas no modo leve (ou enquanto a cena 3D carrega)
 * Também é o "relógio" da simulação das borboletas e da inclinação.
 */
export function EffectsLayer() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const reduced = perf.reducedMotion
    const p = convite.paleta
    const sprites = [glowSprite(p.dourado), glowSprite(p.rosa), glowSprite(p.lilas), glowSprite('#ffffff')]
    let dpr = 1
    let W = 0
    let H = 0
    let dust: Dust[] = []
    const aurora = document.querySelector<HTMLElement>('.aurora')

    const makeDust = () => {
      const n = reduced ? 10 : perf.isLite() ? 16 : 34
      dust = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vy: -(4 + Math.random() * 12),
        r: 3 + Math.random() * 7,
        tw: 0.6 + Math.random() * 2,
        ph: Math.random() * 6.28,
        c: Math.random() < 0.6 ? 0 : Math.random() < 0.5 ? 1 : 2,
        depth: 0.3 + Math.random() * 0.9,
      }))
    }
    const resize = () => {
      dpr = Math.min(perf.isLite() ? 1 : 1.5, window.devicePixelRatio || 1)
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      field.resize(W, H)
      if (!dust.length) makeDust()
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })
    const offLite = perf.subscribe(() => {
      resize()
      makeDust()
    })

    let last = performance.now()
    let raf = 0
    const frame = (nowMs: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(0.05, (nowMs - last) / 1000)
      last = nowMs
      const t = nowMs / 1000
      updateTilt(dt)
      field.step(dt)

      // parallax do fundo pela inclinação do aparelho
      const ox = tilt.x * 14
      const oy = tilt.y * 14
      if (aurora) aurora.style.transform = `translate3d(${-ox * 1.4}px, ${-oy * 1.4}px, 0)`

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'lighter'

      // pó de fada
      for (const d of dust) {
        if (!reduced) {
          d.y += d.vy * dt * d.depth
          d.x += Math.sin(t * 0.6 + d.ph) * 6 * dt
          if (d.y < -20) {
            d.y = H + 20
            d.x = Math.random() * W
          }
        }
        const a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * d.tw + d.ph))
        ctx.globalAlpha = a * 0.75 * d.depth
        const r = d.r * d.depth
        ctx.drawImage(sprites[d.c], d.x + ox * d.depth - r, d.y + oy * d.depth - r, r * 2, r * 2)
      }

      // rastro de brilhos
      for (const s of field.sparkles) {
        const k = 1 - s.life / s.max
        ctx.globalAlpha = k
        const r = s.size * (1.5 + 2.5 * k)
        const spr = sprites[s.hue < 0.5 ? 0 : s.hue < 0.75 ? 1 : 3]
        ctx.drawImage(spr, s.x - r, s.y - r, r * 2, r * 2)
      }

      // borboletas 2D
      ctx.globalCompositeOperation = 'source-over'
      if (!renderState.threeReady) {
        for (const b of field.butterflies) {
          ctx.globalAlpha = 0.28
          const gr = b.size * 0.9
          ctx.drawImage(sprites[2], b.x - gr, b.y - gr, gr * 2, gr * 2)
          ctx.globalAlpha = 1
          drawButterfly(ctx, b, ox, oy)
        }
      }
      ctx.globalAlpha = 1
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      offLite()
    }
  }, [])

  return <canvas ref={ref} className="fx-layer" aria-hidden="true" />
}
