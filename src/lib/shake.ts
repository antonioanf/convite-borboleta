/**
 * Easter egg: chacoalhar o celular solta uma revoada de borboletas.
 * No iOS 13+ a permissão do sensor de movimento precisa ser pedida dentro de um toque
 * (fazemos isso no toque de abertura, junto com a inclinação). Sem permissão: nada acontece.
 */
type Listener = () => void
type IOSMotion = typeof DeviceMotionEvent & { requestPermission?: () => Promise<'granted' | 'denied'> }

const listeners = new Set<Listener>()
let listening = false
let last: { x: number; y: number; z: number } | null = null
let hits: number[] = []
let cooldownUntil = 0

function onMotion(e: DeviceMotionEvent) {
  const a = e.accelerationIncludingGravity
  if (!a || a.x == null || a.y == null || a.z == null) return
  const cur = { x: a.x, y: a.y, z: a.z }
  if (last) {
    const delta = Math.abs(cur.x - last.x) + Math.abs(cur.y - last.y) + Math.abs(cur.z - last.z)
    const now = performance.now()
    if (delta > 22) {
      hits = hits.filter((t) => now - t < 800)
      hits.push(now)
      // 3 sacudidas fortes em menos de 0,8 s = chacoalhou
      if (hits.length >= 3 && now > cooldownUntil) {
        hits = []
        cooldownUntil = now + 3000
        listeners.forEach((l) => l())
      }
    }
  }
  last = cur
}

function listen() {
  if (listening) return
  listening = true
  window.addEventListener('devicemotion', onMotion, { passive: true })
}

/** Chamar DENTRO de um gesto do usuário (toque). */
export function requestShake() {
  try {
    if (typeof window === 'undefined' || !('DeviceMotionEvent' in window)) return
    const DME = DeviceMotionEvent as IOSMotion
    if (typeof DME.requestPermission === 'function') {
      DME.requestPermission()
        .then((r) => r === 'granted' && listen())
        .catch(() => {})
    } else {
      listen()
    }
  } catch {
    /* ignorado */
  }
}

export function onShake(l: Listener) {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}

/** Para testes: simula uma chacoalhada. */
export function fakeShake() {
  listeners.forEach((l) => l())
}
