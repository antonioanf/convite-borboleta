import { convite } from '../../config/convite'
import { Card } from '../ui/Card'
import { Photo } from '../ui/Photo'
import { SectionTitle } from '../ui/SectionTitle'
import { Cake } from '../ui/Cake'
import { indice } from '../../lib/secoes'

/** Seção "Faça um pedido": foto do bolo + bolinho com as velas (interação na etapa 6). */
export function Velinhas() {
  const c = convite.crianca
  const foto = convite.fotoBolo
  return (
    <section id="velinhas" aria-labelledby="t-velinhas" className="wrap pb-14">
      <SectionTitle id="t-velinhas" index={indice('velinhas')} kicker="Faça um pedido" title="Sopre as velinhas" />
      <div className="grid grid-cols-5 gap-3">
        <Card className="reveal col-span-3 p-1.5">
          <div className="relative overflow-hidden rounded-[22px]" style={{ aspectRatio: '3 / 4.4' }}>
            <Photo foto={foto} sizes="(max-width: 480px) 56vw, 270px" />
          </div>
        </Card>
        <Card holo className="reveal col-span-2 flex flex-col items-center justify-between p-3 text-center">
          <span className="label !text-[10px] !tracking-[0.16em]">{c.idade} velinhas</span>
          <div className="flex w-full flex-1 items-center py-2">
            <Cake candles={c.idade} lit />
          </div>
          <p className="text-[13px] font-semibold leading-snug text-tinta-2">Segure o dedo nas velas</p>
        </Card>
      </div>
    </section>
  )
}
