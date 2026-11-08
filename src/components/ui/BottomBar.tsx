import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { convite } from '../../config/convite'
import { useOpened } from '../../hooks/useStores'
import { scroll } from '../../lib/scroll'
import { MusicButton } from './MusicButton'
import { PressButton } from './Press'
import { ButterflyIcon } from './ButterflyIcon'

/**
 * Barra fixa embaixo (alcance do polegar): atalho "Confirmar presença" + música.
 * O atalho some quando a seção de confirmação está na tela.
 */
export function BottomBar() {
  const opened = useOpened()
  const [showCta, setShowCta] = useState(false)

  useEffect(() => {
    if (!opened || !convite.secoes.rsvp) return
    const hero = document.getElementById('inicio')
    const rsvp = document.getElementById('confirmar')
    let pastHero = false
    let rsvpVisible = false
    const update = () => setShowCta(pastHero && !rsvpVisible)
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.target === hero) pastHero = !e.isIntersecting
        if (e.target === rsvp) rsvpVisible = e.isIntersecting
      })
      update()
    })
    if (hero) io.observe(hero)
    if (rsvp) io.observe(rsvp)
    return () => io.disconnect()
  }, [opened])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={opened ? { opacity: 1, y: 0 } : undefined}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex items-end justify-between gap-3 px-[max(16px,env(safe-area-inset-left))] pb-[max(16px,env(safe-area-inset-bottom))]"
    >
      <div className="pointer-events-auto min-w-0">
        <AnimatePresence>
          {showCta && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            >
              <PressButton className="sheen-loop h-14 pl-4 pr-6" onClick={() => scroll.to('#confirmar')}>
                <ButterflyIcon size={24} speed={0.35} />
                Confirmar presença
              </PressButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="pointer-events-auto">
        <MusicButton />
      </div>
    </motion.div>
  )
}
