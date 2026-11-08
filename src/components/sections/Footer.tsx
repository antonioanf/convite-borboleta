import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { convite } from '../../config/convite'
import { shareInvite } from '../../lib/share'
import { vibrate } from '../../lib/haptics'
import { PressButton } from '../ui/Press'
import { ButterflyIcon } from '../ui/ButterflyIcon'
import { Icon } from '../ui/Icons'
import { perf } from '../../lib/perf'
import { dataCurta } from '../../lib/datas'

export function Footer() {
  const [msg, setMsg] = useState<string | null>(null)
  const end = useRef<HTMLDivElement>(null)
  const fly = useAnimationControls()
  const flown = useRef(false)

  // borboleta final: quando a pessoa chega ao fim, ela voa para fora da tela
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
            x: [0, 30, -24, 70, 220],
            y: [0, -50, -130, -230, -480],
            rotate: [0, 16, -12, 22, 28],
            scale: [1, 1.15, 1.05, 1.2, 0.9],
            opacity: [1, 1, 1, 1, 0],
            transition: { duration: 3.2, ease: 'easeInOut' },
          })
        }, 900)
      },
      { threshold: 0.9 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [fly])

  const share = async () => {
    vibrate(10)
    const url = convite.site.url || location.origin
    const res = await shareInvite({
      title: convite.site.titulo,
      text: `${convite.crianca.nome} vai fazer ${convite.crianca.idade} aninhos! 🦋 Veja o convite:`,
      url,
    })
    if (res === 'copied') setMsg('Link copiado! Agora é só colar 💜')
    else if (res === 'failed') setMsg(`Copie o link: ${url}`)
    if (res === 'copied' || res === 'failed') setTimeout(() => setMsg(null), 3500)
  }

  return (
    <footer className="wrap pb-10 pt-4 text-center">
      <div ref={end} className="relative mx-auto flex flex-col items-center">
        <motion.div animate={fly} className="mb-2" aria-hidden="true">
          <ButterflyIcon size={44} speed={0.45} />
        </motion.div>
        {convite.assinatura && <p className="serif text-[38px] leading-tight text-roxo">{convite.assinatura}</p>}
        <p className={`${convite.assinatura ? 'mt-1 text-[16px] font-medium text-tinta-2' : 'serif text-[40px] leading-tight text-roxo'}`}>Esperamos você!</p>
        <p className="label mt-3">
          {convite.crianca.nome} · {convite.crianca.idade} aninhos · {dataCurta}
        </p>
      </div>
      {convite.secoes.compartilhar && (
        <div className="mt-7">
          <PressButton variant="soft" onClick={share} className="w-full">
            <Icon name="compartilhar" size={20} />
            Compartilhar convite
          </PressButton>
          <p className="mt-3 min-h-6 text-[15px] font-semibold text-magenta-txt" role="status" aria-live="polite">
            {msg}
          </p>
        </div>
      )}
    </footer>
  )
}
