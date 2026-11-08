/**
 * Textura da asa (direita) desenhada por código em canvas.
 * A mesma imagem é usada pelo renderizador 3D (CanvasTexture) e pelo 2D (drawImage),
 * então as borboletas ficam idênticas nos dois modos.
 */
import { convite } from '../config/convite'
import { FOREWING, HINDWING } from './butterflySvg'

/** Tamanho do canvas e mapeamento "unidades da asa" → px do canvas. */
export const WING = { W: 160, H: 256, S: 2.6, OX: 4, OY: 128 }
/** Envergadura total da borboleta em unidades da asa (2 asas). */
export const WINGSPAN_UNITS = 104

const cache = new Map<number, HTMLCanvasElement>()

function variantColors(v: number) {
  const p = convite.paleta
  switch (v % 3) {
    case 0:
      return { base: p.violeta, mid: p.violetaClaro, edge: p.rosa, spot: '#ffffff' }
    case 1:
      return { base: p.violetaClaro, mid: p.rosa, edge: p.lilas, spot: p.dourado }
    default:
      return { base: p.violeta, mid: p.lilas, edge: p.rosa, spot: p.dourado }
  }
}

export function wingCanvas(variant: number): HTMLCanvasElement {
  const key = variant % 3
  const hit = cache.get(key)
  if (hit) return hit
  const { W, H, S, OX, OY } = WING
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')!
  const col = variantColors(key)
  const gold = convite.paleta.dourado
  g.setTransform(S, 0, 0, S, OX, OY)

  const fore = new Path2D(FOREWING)
  const hind = new Path2D(HINDWING)

  const paint = (path: Path2D, cy: number, r: number) => {
    g.save()
    g.clip(path)
    const rg = g.createRadialGradient(2, cy * 0.08, 0, 2, cy * 0.08, r * 1.15)
    rg.addColorStop(0, col.base)
    rg.addColorStop(0.5, col.mid)
    rg.addColorStop(0.82, col.edge)
    rg.addColorStop(1, col.edge)
    g.fillStyle = rg
    g.fillRect(-10, -60, 80, 120)
    // veias
    g.strokeStyle = 'rgba(42,17,69,.45)'
    g.lineWidth = 0.7
    for (let i = 0; i < 6; i++) {
      const a = (cy < 0 ? -1 : 1) * (0.15 + i * 0.22)
      g.beginPath()
      g.moveTo(2, cy < 0 ? -3 : 2)
      g.quadraticCurveTo(Math.cos(a) * r * 0.5, Math.sin(a) * r * 0.5, Math.cos(a) * r * 1.2, Math.sin(a) * r * 1.2)
      g.stroke()
    }
    // borda escura com pontinhos dourados
    g.lineWidth = 5
    g.strokeStyle = 'rgba(26,11,46,.85)'
    g.stroke(path)
    g.restore()
  }

  paint(fore, -30, 52)
  paint(hind, 26, 38)

  // manchas
  const spot = (x: number, y: number, r: number, color: string, a = 1) => {
    g.globalAlpha = a
    g.fillStyle = color
    g.beginPath()
    g.arc(x, y, r, 0, Math.PI * 2)
    g.fill()
    g.globalAlpha = 1
  }
  spot(38, -27, 4.2, col.spot, 0.95)
  spot(29, -17, 2.4, gold)
  spot(45, -16, 1.6, '#fff', 0.8)
  spot(26, 24, 3.6, col.spot, 0.75)
  spot(33, 33, 1.6, gold)
  // pontinhos dourados na borda
  g.fillStyle = gold
  ;[
    [44, -40],
    [51, -33],
    [53, -24],
    [49, -15],
    [40, 30],
    [33, 37],
    [24, 37],
  ].forEach(([x, y]) => {
    g.beginPath()
    g.arc(x, y, 1.3, 0, Math.PI * 2)
    g.fill()
  })
  // brilho sutil
  g.save()
  g.clip(fore)
  const sheen = g.createLinearGradient(0, -40, 40, 0)
  sheen.addColorStop(0, 'rgba(255,255,255,0)')
  sheen.addColorStop(0.5, 'rgba(255,255,255,.22)')
  sheen.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = sheen
  g.fillRect(0, -50, 60, 60)
  g.restore()

  cache.set(key, c)
  return c
}
