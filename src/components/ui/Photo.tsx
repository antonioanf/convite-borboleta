import { useState } from 'react'
import type { Foto } from '../../config/convite'
import { ButterflyIcon } from './ButterflyIcon'

/**
 * Foto com placeholder bonito (gradiente + borboleta) quando não há imagem
 * ou quando o arquivo não carrega.
 */
export function Photo({
  foto,
  small = false,
  eager = false,
  sizes,
  className = '',
}: {
  foto: Foto
  small?: boolean
  eager?: boolean
  sizes?: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const src = small ? foto.srcPequena || foto.src : foto.src
  const showImg = !!src && !failed
  return (
    <div className={`absolute inset-0 ${className}`}>
      {(!showImg || !loaded) && (
        <div className="ph" role={showImg ? undefined : 'img'} aria-label={showImg ? undefined : foto.alt}>
          <ButterflyIcon size={72} speed={0.9} />
        </div>
      )}
      {showImg && (
        <img
          src={src}
          srcSet={foto.srcPequena && foto.src ? `${foto.srcPequena} 600w, ${foto.src} 1200w` : undefined}
          sizes={sizes}
          alt={foto.alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={eager ? 'high' : 'auto'}
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          style={{ opacity: loaded ? 1 : 0 }}
        />
      )}
    </div>
  )
}
