/**
 * Desktop: mostra o próprio convite (versão mobile) dentro de uma moldura de celular,
 * com o fundo aurora ao redor. Não existe layout desktop separado.
 */
import { convite } from '../config/convite'

export function mountDesktop() {
  document.getElementById('intro')?.remove()
  const root = document.getElementById('root')!
  const src = new URL(location.href)
  root.innerHTML = `
    <div class="aurora" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
    <div class="grain" aria-hidden="true"></div>
    <main class="desk-shell">
      <div class="desk-side" style="text-align:right">
        <p style="font-family:var(--font-script);font-size:64px;line-height:1" class="shimmer">${convite.crianca.nome}</p>
        <p style="margin-top:12px;font-size:18px;color:var(--color-lilas)">vai completar ${convite.crianca.idade} aninhos 🦋</p>
      </div>
      <div class="desk-phone"><iframe title="Convite de ${convite.crianca.nome}" src="${src.href}"
        allow="autoplay; clipboard-write; web-share; accelerometer; gyroscope; vibrate"></iframe></div>
      <div class="desk-side" style="color:rgb(255 255 255 / .75);font-size:16px">
        <p>Este convite foi feito para o <strong style="color:#fff">celular</strong>.</p>
        <p style="margin-top:8px">Abra o link no seu WhatsApp para a experiência completa — toque nas borboletas! ✨</p>
      </div>
    </main>`
  const phone = root.querySelector<HTMLElement>('.desk-phone')!
  const sides = root.querySelectorAll<HTMLElement>('.desk-side')
  const fit = () => {
    const s = Math.min(1, (innerHeight - 40) / 868)
    phone.style.transform = `scale(${s})`
    phone.style.margin = `${(-868 * (1 - s)) / 2}px ${(-414 * (1 - s)) / 2}px`
    const narrow = innerWidth < 1100
    sides.forEach((el) => (el.style.display = narrow ? 'none' : ''))
  }
  fit()
  addEventListener('resize', fit)
}
