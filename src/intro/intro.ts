/**
 * Intro do casulo. O HTML/CSS já vem no index.html (aparece na hora);
 * aqui só ligamos o toque e a sequência de abertura.
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
    vibrate([18, 40, 12])

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
    await wait(420)
    el.classList.add('is-cracked')
    vibrate(10)
    await wait(330)
    await ready // em celular lento, o casulo fica brilhando rachado até o app estar pronto
    el.classList.add('is-split')
    const cocoon = el.querySelector('.cocoon-wrap')!.getBoundingClientRect()
    butterflyBurst({
      x: cocoon.left + cocoon.width / 2,
      y: cocoon.top + cocoon.height / 2,
      count: 16,
      towardCamera: true,
    })
    await wait(260)
    unlock()
    appState.open()
    el.classList.add('is-gone')
    await wait(900)
    el.remove()
  }

  el.addEventListener('click', open)
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') open(e)
  })
}
