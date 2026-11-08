import { music } from '../../lib/audio'
import { useMusicAvailable, useMusicPlaying } from '../../hooks/useStores'
import { usePress } from '../../hooks/usePress'

/** Botão flutuante de música com ondas sonoras animadas. */
export function MusicButton() {
  const playing = useMusicPlaying()
  const available = useMusicAvailable()
  const { pressed, handlers } = usePress()
  if (!available) return null
  return (
    <button
      type="button"
      {...handlers}
      onClick={() => music.toggle()}
      aria-label={playing ? 'Pausar música' : 'Tocar música'}
      aria-pressed={playing}
      className={`glass glass-blur grid h-14 w-14 shrink-0 place-items-center rounded-full text-rosa transition-transform duration-200 ${pressed ? 'scale-90' : ''}`}
    >
      <span className={`eq ${playing ? 'on' : ''}`} aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
    </button>
  )
}
