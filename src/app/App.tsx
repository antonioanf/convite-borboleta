import { lazy, Suspense, useEffect, useState } from 'react'
import { convite } from '../config/convite'
import { useLite, useOpened } from '../hooks/useStores'
import { Mesh } from '../components/effects/Mesh'
import { EffectsLayer } from '../components/effects/EffectsLayer'
import { BottomBar } from '../components/ui/BottomBar'
import { Hero } from '../components/sections/Hero'
import { Destaque } from '../components/sections/Destaque'
import { Countdown } from '../components/sections/Countdown'
import { Details } from '../components/sections/Details'
import { Gallery } from '../components/sections/Gallery'
import { Velinhas } from '../components/sections/Velinhas'
import { Rsvp } from '../components/sections/Rsvp'
import { Pix } from '../components/sections/Pix'
import { Footer } from '../components/sections/Footer'
import { attachFieldInput, field } from '../lib/butterflyField'
import { ProgressBar } from '../components/fun/ProgressBar'
import { CatchCounter } from '../components/fun/CatchCounter'
import { onShake, fakeShake } from '../lib/shake'
import { vibrate } from '../lib/haptics'
import { sfx } from '../lib/sfx'
import { debug } from '../lib/debug'
import { perf } from '../lib/perf'
import { initScroll, gsap, ScrollTrigger } from '../lib/scroll'

// Cena 3D: chunk separado, só baixado depois da intro e se o aparelho aguentar.
const Butterflies3D = lazy(() => import('../components/effects/Butterflies3D'))

export function App() {
  const opened = useOpened()
  const lite = useLite()
  const [want3D, setWant3D] = useState(false)
  const s = convite.secoes

  useEffect(() => {
    document.documentElement.classList.toggle('lite', lite)
    field.configure({ ambient: perf.reducedMotion ? 3 : lite ? 4 : 6, slow: perf.reducedMotion, lite })
  }, [lite])

  useEffect(() => {
    const lenis = initScroll()
    lenis.stop()
    attachFieldInput()
    // easter egg: chacoalhar o celular solta uma revoada
    const off = onShake(() => {
      field.flock(perf.isLite() ? 5 : 8)
      vibrate([20, 40, 20, 40, 20])
      sfx.sparkle()
    })
    // ganchos para os testes automáticos (npm run testes)
    if (import.meta.env.DEV || debug.teste) Object.assign(window, { __convite: { field, fakeShake } })
    return off
  }, [])

  useEffect(() => {
    if (!opened) return
    initScroll().start()
    field.start(window.innerWidth / 2, window.innerHeight * 0.42)
    const t = setTimeout(() => setWant3D(true), 300)

    // entrada suave de cada seção ao rolar (só transform/opacity)
    let ctx: gsap.Context | undefined
    if (!perf.reducedMotion) {
      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 48, scale: 0.94, filter: 'blur(10px)' },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
              clearProps: 'filter',
              duration: 1.1,
              ease: 'expo.out',
              scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            },
          )
        })
      })
    }
    // fotos com parallax dentro da moldura
    if (!perf.reducedMotion) {
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -6 },
          { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.6 } },
        )
      })
    }
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => {
      clearTimeout(t)
      ctx?.revert()
      window.removeEventListener('load', onLoad)
    }
  }, [opened])

  return (
    <>
      <Mesh />
      <ProgressBar />
      <main className="page" aria-hidden={!opened}>
        <Hero />
        <Destaque />
        {s.contagem && <Countdown />}
        {s.local && <Details />}
        {s.galeria && <Gallery />}
        {s.velinhas && <Velinhas />}
        {s.rsvp && <Rsvp />}
        {s.pix && convite.pix && <Pix />}
        <Footer />
      </main>
      <EffectsLayer />
      {want3D && !lite && (
        <Suspense fallback={null}>
          <Butterflies3D />
        </Suspense>
      )}
      <BottomBar />
      <CatchCounter />
    </>
  )
}
