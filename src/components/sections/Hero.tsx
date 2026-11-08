import { useEffect, useRef } from 'react'
import { animate, motion, useMotionValue, useTransform, type Variants } from 'framer-motion'
import { convite } from '../../config/convite'
import { useOpened } from '../../hooks/useStores'
import { useOffscreenPause } from '../../hooks/useOffscreenPause'
import { Photo } from '../ui/Photo'
import { ButterflyIcon } from '../ui/ButterflyIcon'
import { gsap, ScrollTrigger } from '../../lib/scroll'
import { perf } from '../../lib/perf'

const item: Variants = {
  hide: { opacity: 0, y: 26 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.14, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] },
  }),
}

/** Número da idade surgindo: conta de 0 até a idade com um "pop". */
function AgeNumber({ start }: { start: boolean }) {
  const v = useMotionValue(0)
  const rounded = useTransform(v, (x) => Math.round(x).toString())
  const scale = useMotionValue(0.4)
  useEffect(() => {
    if (!start) return
    const a = animate(v, convite.crianca.idade, { duration: 1.2, delay: 0.8, ease: 'easeOut' })
    const b = animate(scale, [0.4, 1.35, 1], { duration: 1.4, delay: 0.75, ease: 'easeOut' })
    return () => {
      a.stop()
      b.stop()
    }
  }, [start, v, scale])
  return (
    <motion.span
      style={{ scale }}
      className="mx-1.5 inline-block bg-gradient-to-b from-[#fff6dc] to-dourado bg-clip-text align-[-0.12em] text-[64px] font-bold leading-none text-transparent drop-shadow-[0_0_18px_rgba(245,212,138,.55)]"
    >
      <motion.span>{rounded}</motion.span>
    </motion.span>
  )
}

export function Hero() {
  const opened = useOpened()
  const section = useRef<HTMLElement>(null)
  const photo = useRef<HTMLDivElement>(null)
  const title = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  useOffscreenPause(section)
  const c = convite.crianca

  // pin leve + parallax entre foto, título e conteúdo ao rolar
  useEffect(() => {
    if (!opened || perf.reducedMotion) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: '+=40%',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      })
      tl.to(photo.current, { yPercent: -10, scale: 0.9, ease: 'none' }, 0)
        .to(title.current, { y: -28, ease: 'none' }, 0)
        .to(content.current, { opacity: 0.25, y: -40, ease: 'none' }, 0)
      gsap.to(document.querySelector('.aurora-inner'), {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1 },
      })
    }, section)
    // fontes podem mudar alturas
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => ctx.revert()
  }, [opened])

  const anim = opened ? 'show' : 'hide'

  return (
    <section
      ref={section}
      id="inicio"
      aria-label={`Convite de aniversário de ${c.nome}`}
      className="relative flex min-h-[100svh] flex-col items-center justify-center pb-[calc(84px+env(safe-area-inset-bottom))] pt-[max(28px,env(safe-area-inset-top))] text-center"
    >
      <div ref={content} className="wrap flex flex-col items-center">
        <motion.p
          custom={0}
          variants={item}
          initial="hide"
          animate={anim}
          className="text-[13px] font-medium uppercase tracking-[0.24em] text-lilas"
        >
          Você é nosso convidado especial
        </motion.p>

        {/* foto em moldura circular com anel de luz girando; borboletas pousam aqui */}
        <div ref={photo} className="mt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
          animate={opened ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
          transition={{ delay: 0.25, duration: 1.3, ease: [0.2, 0.9, 0.25, 1.15] }}
          className="relative aspect-square w-[min(60vw,240px)]"
        >
          <div className="ring-halo" />
          <div className="ring-light" />
          <div
            data-perch="0.07,0.16,-40;0.95,0.66,35;0.62,0.02,10"
            className="absolute inset-0 overflow-hidden rounded-full border-[3px] border-white/25 shadow-[0_20px_60px_-10px_rgba(124,58,237,.8)]"
          >
            <Photo foto={convite.fotoPrincipal} eager sizes="260px" />
          </div>
          <ButterflyIcon size={44} speed={1.6} className="absolute -bottom-2 -left-3 rotate-[-25deg] drop-shadow-[0_4px_10px_rgba(0,0,0,.4)]" />
        </motion.div>
        </div>

        <div ref={title} className="relative mt-6">
        <motion.div custom={2} variants={item} initial="hide" animate={anim}>
          <h1
            data-perch="0.9,0.22,25"
            className="shimmer px-4 font-script text-[clamp(84px,27vw,120px)] font-normal leading-[1.05]"
          >
            {c.nome}
          </h1>
        </motion.div>
        </div>

        <motion.p custom={3} variants={item} initial="hide" animate={anim} className="mt-1 text-[20px] font-light text-white/90">
          vai completar
          <AgeNumber start={opened} />
          {c.idade === 1 ? 'aninho' : 'aninhos'}
        </motion.p>

        <motion.p
          custom={4}
          variants={item}
          initial="hide"
          animate={anim}
          className="mt-4 max-w-[30ch] text-[17px] leading-relaxed text-lilas"
        >
          {c.frase}
        </motion.p>
      </div>

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={opened ? { opacity: 1 } : undefined}
        transition={{ delay: 1.8 }}
        className="mt-8 flex flex-col items-center gap-1 text-[13px] uppercase tracking-[0.2em] text-white/60"
      >
        Deslize
        <motion.svg width="22" height="22" viewBox="0 0 24 24" animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        </motion.svg>
      </motion.div>
    </section>
  )
}
