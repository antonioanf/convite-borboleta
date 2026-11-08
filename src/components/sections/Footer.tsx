import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { convite } from '../../config/convite'
import { shareInvite } from '../../lib/share'
import { vibrate } from '../../lib/haptics'
import { PressButton } from '../ui/Press'
import { ButterflyIcon } from '../ui/ButterflyIcon'
import { perf } from '../../lib/perf'

export function Footer() {
  const [msg, setMsg] = useState<string | null>(null)
  const end = useRef<HTMLDivElement>(null)
  const fly = useAnimationControls()
  const flown = useRef(false)

  // borboleta final: quando o usuário chega ao fim, ela voa para fora da tela
  useEffect(() => {
    const el = end.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || flown.current) return
        flown.current = true
        io.disconnect()
        if (perf.reducedMotion) return
        setTimeout(() => {
          fly.start({
            x: [0, 40, -30, 90, 260],
            y: [0, -60, -150, -260, -520],
            rotate: [0, 18, -14, 24, 30],
            scale: [1, 1.15, 1.05, 1.2, 0.9],
            opacity: [1, 1, 1, 1, 0],
            transition: { duration: 3.2, ease: 'easeInOut' },
          })
        }, 700)
      },
      { threshold: 0.9 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [fly])

  const share = async () => {
    vibrate(10)
    const res = await shareInvite({
      title: convite.site.titulo,
      text: `${convite.crianca.nome} vai fazer ${convite.crianca.idade} aninhos! 🦋 Veja o convite:`,
      url: convite.site.url || location.href,
    })
    if (res === 'copied') setMsg('Link copiado! Agora é só colar 💜')
    else if (res === 'failed') setMsg(`Copie o link: ${convite.site.url}`)
    if (res === 'copied' || res === 'failed') setTimeout(() => setMsg(null), 3500)
  }

  return (
    <footer className="wrap reveal pb-10 pt-6 text-center">
      <div ref={end} className="relative mx-auto flex flex-col items-center">
        <motion.div animate={fly} className="mb-3" aria-hidden="true">
          <ButterflyIcon size={64} speed={0.4} />
        </motion.div>
        <p className="font-script text-[44px] leading-tight text-white drop-shadow-[0_2px_16px_rgba(240,171,252,.5)]">{convite.assinatura}</p>
        <p className="mt-1 text-[15px] text-white/70">Esperamos você! 🦋</p>
      </div>
      {convite.secoes.compartilhar && (
        <div className="mt-8">
          <PressButton variant="ghost" onClick={share} className="w-full">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v14" />
            </svg>
            Compartilhar convite
          </PressButton>
          <p className="mt-3 min-h-6 text-[15px] text-rosa" role="status" aria-live="polite">
            {msg}
          </p>
        </div>
      )}
    </footer>
  )
}
