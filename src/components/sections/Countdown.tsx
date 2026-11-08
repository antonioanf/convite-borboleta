import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { convite } from '../../config/convite'
import { useNow } from '../../hooks/useStores'
import { useOffscreenPause } from '../../hooks/useOffscreenPause'
import { eventTimes } from '../../lib/calendar'
import { GlassCard } from '../ui/GlassCard'
import { SectionTitle } from '../ui/SectionTitle'
import { ButterflyIcon } from '../ui/ButterflyIcon'
import { field } from '../../lib/butterflyField'

type Phase = 'antes' | 'hoje' | 'depois'

const dayKey = (d: Date) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: convite.festa.fusoHorario, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)

export function partyPhase(nowMs: number): Phase {
  const { start, end } = eventTimes(convite)
  if (nowMs >= end.getTime()) return 'depois'
  if (dayKey(new Date(nowMs)) === dayKey(start)) return 'hoje'
  return nowMs < start.getTime() ? 'antes' : 'hoje'
}

/** Cartão que vira (flip) quando o valor muda. */
function Flip({ value }: { value: string }) {
  const [s, setS] = useState({ cur: value, prev: value, n: 0 })
  if (value !== s.cur) setS({ cur: value, prev: s.cur, n: s.n + 1 })
  return (
    <div className="flip" aria-hidden="true">
      <div className="flip-half flip-top">
        <span>{s.cur}</span>
      </div>
      <div className="flip-half flip-bottom">
        <span>{s.prev}</span>
      </div>
      {s.n > 0 && (
        <>
          <div key={`t${s.n}`} className="flip-half flip-top anim">
            <span>{s.prev}</span>
          </div>
          <div key={`b${s.n}`} className="flip-half flip-bottom anim">
            <span>{s.cur}</span>
          </div>
        </>
      )}
    </div>
  )
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-2">
      <Flip value={String(value).padStart(2, '0')} />
      <span className="text-[13px] font-medium uppercase tracking-[0.14em] text-lilas">{label}</span>
    </div>
  )
}

function Today() {
  const ref = useRef<HTMLDivElement>(null)
  // efeito especial: revoadas periódicas de borboletas saindo do título
  useEffect(() => {
    const fire = () => {
      const r = ref.current?.getBoundingClientRect()
      if (r && r.top < innerHeight && r.bottom > 0) field.burst(r.left + r.width / 2, r.top + r.height / 2, 4)
    }
    const id = setInterval(fire, 4500)
    const first = setTimeout(fire, 600)
    return () => {
      clearInterval(id)
      clearTimeout(first)
    }
  }, [])
  const hora = new Intl.DateTimeFormat('pt-BR', { timeZone: convite.festa.fusoHorario, hour: '2-digit', minute: '2-digit' })
    .format(new Date(convite.festa.dataHora))
    .replace(':00', 'h')
  return (
    <div ref={ref} className="py-4 text-center">
      <motion.p
        initial={{ scale: 0.6, opacity: 0 }}
        whileInView={{ scale: [0.6, 1.15, 1], opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="shimmer font-script text-[72px] leading-none"
      >
        É hoje!
      </motion.p>
      <div className="mt-2 flex justify-center gap-2" aria-hidden="true">
        <ButterflyIcon size={34} speed={0.3} />
        <ButterflyIcon size={26} speed={0.25} className="-mt-3" />
        <ButterflyIcon size={34} speed={0.35} />
      </div>
      <p className="mt-3 text-[18px] text-white/90">
        Te esperamos às <strong className="text-gold">{hora}</strong> 🦋
      </p>
    </div>
  )
}

function Thanks() {
  return (
    <div className="py-4 text-center">
      <p className="font-script text-[54px] leading-tight text-white">Obrigado!</p>
      <p className="mx-auto mt-2 max-w-[28ch] text-[17px] leading-relaxed text-lilas">
        A festa foi mágica porque você fez parte dela. {convite.crianca.nome} agradece cada abraço e cada sorriso 💜
      </p>
    </div>
  )
}

export function Countdown() {
  const nowMs = useNow(1000)
  const ref = useRef<HTMLElement>(null)
  useOffscreenPause(ref)
  const phase = partyPhase(nowMs)
  const diff = Math.max(0, new Date(convite.festa.dataHora).getTime() - nowMs)
  const d = Math.floor(diff / 86_400_000)
  const h = Math.floor((diff / 3_600_000) % 24)
  const m = Math.floor((diff / 60_000) % 60)
  const sec = Math.floor((diff / 1000) % 60)

  return (
    <section ref={ref} id="contagem" aria-labelledby="t-contagem" className="wrap reveal pt-6 pb-14">
      <SectionTitle id="t-contagem" kicker={phase === 'depois' ? 'Foi lindo' : 'Contagem regressiva'} title={phase === 'antes' ? 'Falta pouco!' : phase === 'hoje' ? 'Chegou o dia' : 'Que festa!'} />
      <GlassCard blur className="px-4 py-6">
        {phase === 'antes' && (
          <>
            <div role="timer" className="flex gap-2.5">
              <Unit value={d} label={d === 1 ? 'dia' : 'dias'} />
              <Unit value={h} label="horas" />
              <Unit value={m} label="min" />
              <Unit value={sec} label="seg" />
            </div>
            <p className="sr-only-live">
              Faltam {d} dias, {h} horas e {m} minutos para a festa.
            </p>
          </>
        )}
        {phase === 'hoje' && <Today />}
        {phase === 'depois' && <Thanks />}
      </GlassCard>
    </section>
  )
}
