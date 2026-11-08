// Funções puras (sem DOM) — também usadas pelo vite.config.ts para gerar /convite.ics.
import type { ConviteConfig } from '../config/convite.ts'

function toUtcStamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

export function eventTimes(c: ConviteConfig) {
  const start = new Date(c.festa.dataHora)
  const end = new Date(start.getTime() + c.festa.duracaoHoras * 3600_000)
  return { start, end }
}

export function eventTitle(c: ConviteConfig) {
  return `Aniversário de ${c.crianca.nome} 🦋 ${c.crianca.idade} anos`
}

export function googleCalendarUrl(c: ConviteConfig): string {
  const { start, end } = eventTimes(c)
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventTitle(c),
    dates: `${toUtcStamp(start)}/${toUtcStamp(end)}`,
    details: `${c.crianca.frase}\n\nConvite: ${c.site.url}`,
    location: `${c.festa.local}, ${c.festa.endereco}`,
  })
  return `https://calendar.google.com/calendar/render?${p.toString()}`
}

function icsEscape(s: string) {
  return s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')
}

export function buildIcs(c: ConviteConfig): string {
  const { start, end } = eventTimes(c)
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Convite Borboleta//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${toUtcStamp(start)}-${c.crianca.nome.toLowerCase().replace(/\W/g, '')}@convite`,
    `DTSTAMP:${toUtcStamp(new Date())}`,
    `DTSTART:${toUtcStamp(start)}`,
    `DTEND:${toUtcStamp(end)}`,
    `SUMMARY:${icsEscape(eventTitle(c))}`,
    `DESCRIPTION:${icsEscape(`${c.crianca.frase}\n\nConvite: ${c.site.url}`)}`,
    `LOCATION:${icsEscape(`${c.festa.local}, ${c.festa.endereco}`)}`,
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:${icsEscape(`Amanhã é a festa de ${c.crianca.nome}!`)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.join('\r\n') + '\r\n'
}
