import { lazy, Suspense, useEffect, useState } from 'react'
import { convite } from '../config/convite'
import { useLite, useOpened } from '../hooks/useStores'
import { Aurora } from '../components/effects/Aurora'
import { EffectsLayer } from '../components/effects/EffectsLayer'
import { BottomBar } from '../components/ui/BottomBar'
import { Hero } from '../components/sections/Hero'
import { Countdown } from '../components/sections/Countdown'
import { Details } from '../components/sections/Details'
import { Gallery } from '../components/sections/Gallery'
import { Rsvp } from '../components/sections/Rsvp'
import { Pix } from '../components/sections/Pix'
import { Footer } from '../components/sections/Footer'
import { attachFieldInput, field } from '../lib/butterflyField'
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
    field.configure({ ambient: perf.reducedMotion ? 3 : lite ? 5 : 8, slow: perf.reducedMotion })
  }, [lite])

  useEffect(() => {
    const lenis = initScroll()
    lenis.stop()
    attachFieldInput()
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
            { opacity: 0, y: 60, scale: 0.94 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1.1,
              ease: 'expo.out',
              scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            },
          )
        })
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
      <Aurora />
      <main className="page" aria-hidden={!opened}>
        <Hero />
        {s.contagem && <Countdown />}
        {s.local && <Details />}
        {s.galeria && <Gallery />}
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
    </>
  )
}
