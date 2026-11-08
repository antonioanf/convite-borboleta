import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { convite } from '../../config/convite'
import { GlassCard } from '../ui/GlassCard'
import { SectionTitle } from '../ui/SectionTitle'
import { PressButton } from '../ui/Press'
import { copyText } from '../../lib/share'
import { vibrate } from '../../lib/haptics'
import { field } from '../../lib/butterflyField'

export function Pix() {
  const pix = convite.pix!
  const [state, setState] = useState<'idle' | 'copied' | 'manual'>('idle')
  const keyRef = useRef<HTMLParagraphElement>(null)
  const btn = useRef<HTMLButtonElement>(null)
  const timer = useRef(0)

  const copy = async () => {
    const ok = await copyText(pix.chave)
    clearTimeout(timer.current)
    if (ok) {
      vibrate([12, 30, 12])
      setState('copied')
      const r = btn.current?.getBoundingClientRect()
      if (r) field.emitSparkles(r.left + r.width / 2, r.top + r.height / 2, 26, 180)
      timer.current = window.setTimeout(() => setState('idle'), 2400)
    } else {
      // sem área de transferência: seleciona a chave para copiar manualmente
      const sel = window.getSelection()
      if (sel && keyRef.current) {
        const range = document.createRange()
        range.selectNodeContents(keyRef.current)
        sel.removeAllRanges()
        sel.addRange(range)
      }
      setState('manual')
    }
  }

  return (
    <section id="presentes" aria-labelledby="t-pix" className="wrap reveal pb-14">
      <SectionTitle id="t-pix" kicker="Lista de presentes" title="Um mimo?" />
      <GlassCard className="p-6 text-center">
        <p className="text-[16px] leading-relaxed text-white/85">{pix.mensagem}</p>
        <div className="mt-5 rounded-2xl border border-dashed border-dourado/50 bg-noite/40 px-4 py-4">
          <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-lilas">Chave Pix · {pix.tipo}</p>
          <p ref={keyRef} className="mt-1 select-all break-all text-[18px] font-semibold text-white">
            {pix.chave}
          </p>
          <p className="mt-1 text-[15px] text-white/65">{pix.titular}</p>
        </div>
        <PressButton ref={btn} variant="gold" onClick={copy} className="mt-5 w-full" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={state}
              initial={{ y: 14, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="inline-flex items-center gap-2"
            >
              {state === 'copied' ? 'Copiado! 💜' : state === 'manual' ? 'Chave selecionada — copie 👆' : 'Copiar chave Pix'}
            </motion.span>
          </AnimatePresence>
        </PressButton>
      </GlassCard>
    </section>
  )
}
