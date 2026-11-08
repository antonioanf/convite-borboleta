/**
 * Intro: borboleta holográfica + "Toque para abrir".
 * O HTML/CSS já vem no index.html (aparece na hora); aqui só ligamos o toque
 * e a sequência de abertura: asas batem → abrem → brilho iridescente dissolve a tela.
 */
import { appState } from '../lib/appState'
import { butterflyBurst, prefersReducedMotion } from '../lib/butterflySvg'
import { vibrate } from '../lib/haptics'
import { music } from '../lib/audio'
import { requestTilt } from '../lib/tilt'
import { debug } from '../lib/debug'
import { loadApp } from '../lib/appLoader'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

function unlock() {
  document.documentElement.classList.remove('locked')
}

export function initIntro() {
  const el = document.getElementById('intro')
  if (!el) {
    unlock()
    appState.open()
    return
  }
  if (debug.abrir) {
    el.remove()
    unlock()
    appState.open()
    return
  }
  // começa a preparar o app assim que o dedo encosta (antes do clique)
  el.addEventListener('pointerdown', () => loadApp(), { once: true, passive: true })

  let started = false
  const open = async (e?: Event) => {
    if (started) return
    started = true
    e?.preventDefault()
    const ready = loadApp().then(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
    // Tudo que precisa de "gesto do usuário" acontece aqui, de forma síncrona:
    requestTilt()
    music.start()
    vibrate([14, 40, 10])

    const reduced = prefersReducedMotion()
    el.classList.add('is-opening')
    el.setAttribute('aria-hidden', 'true')
    if (reduced) {
      await ready
      el.classList.add('is-gone')
      unlock()
      appState.open()
      await wait(500)
      el.remove()
      return
    }
    await wait(560) // asas batendo rápido
    await ready // em celular lento, a borboleta continua batendo as asas até o app estar pronto
    el.classList.add('is-open')
    vibrate(10)
    const bf = el.querySelector('.bf-wrap')!.getBoundingClientRect()
    butterflyBurst({ x: bf.left + bf.width / 2, y: bf.top + bf.height / 2, count: 10, towardCamera: true })
    await wait(380)
    unlock()
    appState.open()
    el.classList.add('is-gone')
    await wait(950)
    el.remove()
  }

  el.addEventListener('click', open)
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') open(e)
  })
}
