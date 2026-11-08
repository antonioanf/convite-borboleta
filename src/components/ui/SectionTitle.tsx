import { ButterflyIcon } from './ButterflyIcon'

export function SectionTitle({ kicker, title, id }: { kicker: string; title: string; id?: string }) {
  return (
    <header className="mb-6 text-center">
      <p className="flex items-center justify-center gap-2 text-[13px] font-medium uppercase tracking-[0.22em] text-lilas">
        <ButterflyIcon size={18} flap={false} />
        {kicker}
      </p>
      <h2 id={id} className="mt-1 font-script text-[52px] leading-[1.05] text-white drop-shadow-[0_2px_18px_rgba(168,85,247,.6)]">
        {title}
      </h2>
    </header>
  )
}
