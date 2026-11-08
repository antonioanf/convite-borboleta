import { useId, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { convite } from '../../config/convite'
import { GlassCard } from '../ui/GlassCard'
import { SectionTitle } from '../ui/SectionTitle'
import { PressButton, PressLink } from '../ui/Press'
import { ButterflyIcon } from '../ui/ButterflyIcon'
import { vibrate } from '../../lib/haptics'
import { field } from '../../lib/butterflyField'
import { now } from '../../lib/debug'
import { perf } from '../../lib/perf'

const r = convite.rsvp
const prazo = new Date(`${r.prazo || "2099-01-01"}T23:59:59-03:00`)
const prazoTxt = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', timeZone: convite.festa.fusoHorario }).format(prazo)

function waUrl(nome: string, pessoas: number, recado: string) {
  const linhas = [
    `Olá! 🦋 Confirmo presença no aniversário de ${convite.crianca.nome}!`,
    '',
    `Nome: ${nome}`,
    `Pessoas: ${pessoas}`,
  ]
  if (recado.trim()) linhas.push(`Recado: ${recado.trim()}`)
  return `https://wa.me/${r.whatsapp}?text=${encodeURIComponent(linhas.join('\n'))}`
}

async function celebrate(origin: HTMLElement | null) {
  const rect = origin?.getBoundingClientRect()
  const x = rect ? rect.left + rect.width / 2 : innerWidth / 2
  const y = rect ? rect.top + rect.height / 2 : innerHeight / 2
  field.burst(x, y, perf.isLite() ? 4 : 8)
  if (perf.reducedMotion) return
  const { default: confetti } = await import('canvas-confetti')
  const p = convite.paleta
  const colors = [p.violeta, p.lilas, p.lilas, p.rosa, p.prata, '#ffffff']
  const o = { x: x / innerWidth, y: y / innerHeight }
  const base = { colors, disableForReducedMotion: true, zIndex: 95, scalar: 1.05 }
  confetti({ ...base, particleCount: perf.isLite() ? 60 : 120, spread: 80, startVelocity: 48, origin: o })
  setTimeout(() => confetti({ ...base, particleCount: 50, angle: 60, spread: 60, origin: { x: 0, y: 0.75 } }), 220)
  setTimeout(() => confetti({ ...base, particleCount: 50, angle: 120, spread: 60, origin: { x: 1, y: 0.75 } }), 380)
}

export function Rsvp() {
  const id = useId()
  const [nome, setNome] = useState('')
  const [pessoas, setPessoas] = useState(1)
  const [recado, setRecado] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [shake, setShake] = useState(0)
  const [enviado, setEnviado] = useState<string | null>(null)
  const nomeRef = useRef<HTMLInputElement>(null)
  const submitRef = useRef<HTMLButtonElement>(null)
  const timer = useRef(0)
  const passouPrazo = now() > prazo.getTime()

  const setQtd = (n: number) => setPessoas(Math.max(1, Math.min(r.maxPessoas, n || 1)))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const n = nome.trim().replace(/\s+/g, ' ')
    if (n.length < 2) {
      setErro(n.length === 0 ? 'Conta pra gente o seu nome 💜' : 'Seu nome parece curtinho demais — pode completar?')
      setShake((s) => s + 1)
      vibrate([30, 40, 30])
      nomeRef.current?.focus()
      return
    }
    setErro(null)
    vibrate([20, 40, 20, 40, 60])
    const url = waUrl(n, pessoas, recado)
    setEnviado(url)
    celebrate(submitRef.current)
    // abre o WhatsApp dos pais com a mensagem pronta
    timer.current = window.setTimeout(() => {
      window.location.href = url
    }, 1600)
  }

  return (
    <section id="confirmar" aria-labelledby="t-rsvp" className="wrap reveal pb-14">
      <SectionTitle id="t-rsvp" kicker="Confirmação de presença" title="Você vem?" />
      <GlassCard blur className="p-6">
        <AnimatePresence mode="wait" initial={false}>
          {!enviado ? (
            <motion.form
              key="form"
              noValidate
              onSubmit={submit}
              exit={{ opacity: 0, scale: 0.96 }}
              className="flex flex-col gap-5"
            >
              <p className="text-center text-[16px] text-white/85">
                {passouPrazo ? (
                  <>O prazo era até {prazoTxt}, mas ainda dá para avisar a família 💜</>
                ) : (
                  <>
                    Confirme até <strong className="text-gold">{prazoTxt}</strong> para prepararmos tudo com carinho.
                  </>
                )}
              </p>

              <motion.div key={shake} animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : undefined} transition={{ duration: 0.4 }}>
                <label htmlFor={`${id}-nome`} className="mb-2 block text-[15px] font-medium text-lilas">
                  Seu nome
                </label>
                <input
                  ref={nomeRef}
                  id={`${id}-nome`}
                  name="nome"
                  type="text"
                  inputMode="text"
                  autoComplete="name"
                  autoCapitalize="words"
                  enterKeyHint="next"
                  maxLength={60}
                  value={nome}
                  onChange={(e) => {
                    setNome(e.target.value)
                    if (erro) setErro(null)
                  }}
                  aria-invalid={!!erro}
                  aria-describedby={erro ? `${id}-erro` : undefined}
                  placeholder="Ex.: Ana e família"
                  className={`h-14 w-full rounded-2xl border bg-white/[.07] px-4 text-[17px] text-white placeholder:text-white/40 outline-none transition-colors focus:border-rosa focus:bg-white/10 ${erro ? 'border-rosa' : 'border-white/20'}`}
                />
                <AnimatePresence>
                  {erro && (
                    <motion.p
                      id={`${id}-erro`}
                      role="alert"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-2 text-[15px] text-rosa"
                    >
                      {erro}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <div>
                <label htmlFor={`${id}-qtd`} className="mb-2 block text-[15px] font-medium text-lilas">
                  Quantas pessoas (contando você)?
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      vibrate(8)
                      setQtd(pessoas - 1)
                    }}
                    disabled={pessoas <= 1}
                    aria-label="Diminuir"
                    className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/10 text-[26px] text-white transition active:scale-90 disabled:opacity-40"
                  >
                    −
                  </button>
                  <input
                    id={`${id}-qtd`}
                    name="pessoas"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    enterKeyHint="next"
                    value={pessoas}
                    onChange={(e) => setQtd(parseInt(e.target.value.replace(/\D/g, ''), 10))}
                    className="h-14 w-full min-w-0 rounded-2xl border border-white/20 bg-white/[.07] text-center text-[22px] font-semibold tabular-nums text-white outline-none focus:border-rosa"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      vibrate(8)
                      setQtd(pessoas + 1)
                    }}
                    disabled={pessoas >= r.maxPessoas}
                    aria-label="Aumentar"
                    className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/10 text-[26px] text-white transition active:scale-90 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor={`${id}-recado`} className="mb-2 flex justify-between text-[15px] font-medium text-lilas">
                  <span>Recado para a {convite.crianca.nome} (opcional)</span>
                  <span className="tabular-nums text-white/50" aria-hidden="true">
                    {recado.length}/280
                  </span>
                </label>
                <textarea
                  id={`${id}-recado`}
                  name="recado"
                  inputMode="text"
                  enterKeyHint="done"
                  rows={3}
                  maxLength={280}
                  value={recado}
                  onChange={(e) => setRecado(e.target.value)}
                  placeholder="Escreva um carinho ✨"
                  className="w-full resize-none rounded-2xl border border-white/20 bg-white/[.07] px-4 py-3 text-[17px] text-white placeholder:text-white/40 outline-none focus:border-rosa focus:bg-white/10"
                />
              </div>

              <PressButton ref={submitRef} type="submit" className="sheen-loop mt-1 h-16 w-full text-[18px]">
                <ButterflyIcon size={26} speed={0.3} />
                Confirmar presença
              </PressButton>
              <p className="-mt-2 text-center text-[14px] text-white/60">Vamos abrir o WhatsApp com a mensagem pronta.</p>
            </motion.form>
          ) : (
            <motion.div
              key="ok"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="flex flex-col items-center gap-4 py-4 text-center"
              role="status"
            >
              <ButterflyIcon size={72} speed={0.25} />
              <p className="shimmer font-script text-[56px] leading-none">Oba!</p>
              <p className="text-[18px] text-white">Presença confirmada 💜</p>
              <p className="text-[16px] text-white/75">Abrindo o WhatsApp com a sua mensagem…</p>
              <PressLink href={enviado} variant="gold" className="mt-2 w-full">
                Abrir WhatsApp
              </PressLink>
              <button type="button" onClick={() => {
                  clearTimeout(timer.current)
                  setEnviado(null)
                }} className="min-h-12 px-4 text-[15px] text-lilas underline underline-offset-4">
                Editar confirmação
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </section>
  )
}
