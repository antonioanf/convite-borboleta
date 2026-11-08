import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
import { motion } from 'framer-motion'
import { convite } from '../../config/convite'
import { Photo } from '../ui/Photo'
import { SectionTitle } from '../ui/SectionTitle'
import { Lightbox } from './Lightbox'
import { vibrate } from '../../lib/haptics'

const fotos = convite.galeria.length ? convite.galeria : [{ alt: 'Foto do ensaio' }, { alt: 'Foto do ensaio' }, { alt: 'Foto do ensaio' }]

/** Foto do carrossel: revelação circular ao entrar + tilt 3D enquanto o dedo segura. */
function Slide({ index, onOpen }: { index: number; onOpen: (i: number, el: HTMLElement) => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const holding = useRef(false)

  const tilt = (e: PointerEvent) => {
    const el = ref.current
    if (!el || !inner.current || !holding.current) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    inner.current.style.transform = `perspective(700px) rotateY(${px * 16}deg) rotateX(${-py * 16}deg) scale(.97)`
  }
  const release = () => {
    holding.current = false
    if (inner.current) inner.current.style.transform = ''
  }

  return (
    <button
      ref={ref}
      type="button"
      aria-label={`Abrir foto ${index + 1}: ${fotos[index].alt}`}
      onPointerDown={(e) => {
        holding.current = true
        tilt(e)
      }}
      onPointerMove={tilt}
      onPointerUp={release}
      onPointerCancel={release}
      onPointerLeave={release}
      onClick={() => {
        vibrate(8)
        if (ref.current) onOpen(index, ref.current)
      }}
      className="relative block aspect-[4/5] w-full rounded-[26px] text-left"
    >
      <div ref={inner} className="absolute inset-0 transition-transform duration-300 ease-out" style={{ transformStyle: 'preserve-3d' }}>
        <motion.div
          initial={{ clipPath: 'circle(0% at 50% 60%)' }}
          whileInView={{ clipPath: 'circle(75% at 50% 50%)' }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.1, ease: [0.3, 0.8, 0.2, 1] }}
          className="absolute inset-0 overflow-hidden rounded-[26px] shadow-[0_24px_50px_-20px_rgba(0,0,0,.8)] ring-1 ring-white/15"
        >
          <Photo foto={fotos[index]} small sizes="(max-width: 480px) 74vw, 360px" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-noite/70 to-transparent" />
        </motion.div>
      </div>
    </button>
  )
}

export function Gallery() {
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState<number | null>(null)
  const opener = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = track.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const first = el.children[0] as HTMLElement | undefined
        if (!first) return
        const step = first.offsetWidth + 14
        setActive(Math.max(0, Math.min(fotos.length - 1, Math.round(el.scrollLeft / step))))
      })
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const goTo = (i: number) => {
    const el = track.current
    const child = el?.children[i] as HTMLElement | undefined
    if (el && child) el.scrollTo({ left: child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2, behavior: 'smooth' })
  }

  const onOpen = useCallback((i: number, el: HTMLElement) => {
    opener.current = el
    setOpen(i)
  }, [])

  return (
    <section id="galeria" aria-labelledby="t-galeria" className="reveal pb-14">
      <div className="wrap">
        <SectionTitle id="t-galeria" kicker="Ensaio" title="Momentos mágicos" />
      </div>
      <div ref={track} className="carousel" role="list" data-no-spawn>
        {fotos.map((_, i) => (
          <div role="listitem" key={i}>
            <Slide index={i} onOpen={onOpen} />
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-1" role="group" aria-label="Escolher foto">
        {fotos.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ir para a foto ${i + 1}`}
            aria-current={i === active}
            className="grid h-12 w-8 place-items-center"
          >
            <span
              className={`block h-2 rounded-full transition-all duration-300 ${i === active ? 'w-6 bg-gradient-to-r from-rosa to-dourado' : 'w-2 bg-white/35'}`}
            />
          </button>
        ))}
      </div>
      <p className="mt-1 text-center text-[15px] text-white/70">Deslize para o lado e toque para ampliar</p>
      <Lightbox
        fotos={fotos}
        index={open}
        onClose={() => {
          setOpen(null)
          opener.current?.focus({ preventScroll: true })
        }}
      />
    </section>
  )
}
