import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { convite } from '../../config/convite'
import { googleCalendarUrl } from '../../lib/calendar'
import { GlassCard } from '../ui/GlassCard'
import { SectionTitle } from '../ui/SectionTitle'
import { PressButton, PressLink } from '../ui/Press'

const tz = convite.festa.fusoHorario
const start = new Date(convite.festa.dataHora)
const weekday = new Intl.DateTimeFormat('pt-BR', { timeZone: tz, weekday: 'long' }).format(start)
const dayMonth = new Intl.DateTimeFormat('pt-BR', { timeZone: tz, day: 'numeric', month: 'long' }).format(start)
const year = new Intl.DateTimeFormat('pt-BR', { timeZone: tz, year: 'numeric' }).format(start)
const hour = new Intl.DateTimeFormat('pt-BR', { timeZone: tz, hour: '2-digit', minute: '2-digit' })
  .format(start)
  .replace(/:00$/, 'h')
  .replace(':', 'h')
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const list: Variants = { hide: {}, show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } } }
const row: Variants = {
  hide: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] } },
}

function Icon({ d }: { d: string }) {
  return (
    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violeta to-violeta-claro shadow-[0_8px_20px_-8px_rgba(168,85,247,.9)]">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={d} />
      </svg>
    </span>
  )
}

function Row({ icon, label, children }: { icon: string; label: string; children: ReactNode }) {
  return (
    <motion.li variants={row} className="flex items-center gap-4">
      <Icon d={icon} />
      <div className="min-w-0">
        <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-lilas">{label}</p>
        <div className="text-[18px] leading-snug text-white">{children}</div>
      </div>
    </motion.li>
  )
}

const isApple = typeof navigator !== 'undefined' && /iPhone|iPad|Macintosh/.test(navigator.userAgent)

export function Details() {
  const [agenda, setAgenda] = useState(false)
  const f = convite.festa
  const gcal = (
    <PressLink key="g" variant="ghost" href={googleCalendarUrl(convite)} target="_blank" rel="noopener" className="w-full">
      Google Agenda
    </PressLink>
  )
  const ics = (
    <PressLink key="i" variant="ghost" href="/convite.ics" download="aniversario.ics" className="w-full">
      {isApple ? 'Agenda do iPhone' : 'Outras agendas (.ics)'}
    </PressLink>
  )

  return (
    <section id="local" aria-labelledby="t-local" className="wrap reveal pb-14">
      <SectionTitle id="t-local" kicker="Quando e onde" title="Anote aí" />
      <GlassCard className="p-6">
        <motion.ul variants={list} initial="hide" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="flex flex-col gap-5">
          <Row label="Data" icon="M8 2v4M16 2v4M3 9h18M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z">
            <strong className="font-semibold">{cap(weekday)}</strong>, {dayMonth} de {year}
          </Row>
          <Row label="Horário" icon="M12 7v5l3 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z">
            A partir das <strong className="font-semibold text-gold">{hour}</strong>
          </Row>
          <Row label="Local" icon="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z">
            <strong className="font-semibold">{f.local}</strong>
            <span className="block text-[16px] text-white/75">{f.endereco}</span>
          </Row>
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-7 flex flex-col gap-3"
        >
          <PressLink href={f.linkMapa} target="_blank" rel="noopener" className="w-full">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M3 11l18-8-8 18-2-8-8-2z" strokeLinejoin="round" />
            </svg>
            Como chegar
          </PressLink>
          <PressButton variant="ghost" className="w-full" aria-expanded={agenda} onClick={() => setAgenda((v) => !v)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 8v8M8 12h8M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
            </svg>
            Adicionar à agenda
          </PressButton>
          <AnimatePresence initial={false}>
            {agenda && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 gap-3"
              >
                {isApple ? [ics, gcal] : [gcal, ics]}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </GlassCard>
    </section>
  )
}
