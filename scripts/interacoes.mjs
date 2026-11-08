// Testes de interação (Playwright, Pixel 5). Uso: node scripts/interacoes.mjs [url]
import { chromium, devices } from 'playwright'
import fs from 'node:fs'
const url = process.argv[2] ?? 'http://localhost:5173/'
const out = 'screenshots/interacoes'
fs.mkdirSync(out, { recursive: true })
const { defaultBrowserType, ...pixel } = devices['Pixel 5'] // eslint-disable-line no-unused-vars
const browser = await chromium.launch()
const log = []
const ctxOpts = { ...pixel, locale: 'pt-BR', timezoneId: 'America/Fortaleza', permissions: ['clipboard-read', 'clipboard-write'] }

// 1) abertura quadro a quadro
{
  const page = await (await browser.newContext(ctxOpts)).newPage()
  page.on('pageerror', (e) => log.push('pageerror ' + e.message))
  await page.goto(url)
  await page.waitForTimeout(600)
  await page.tap('#intro')
  for (const ms of [450, 850, 1150, 1600]) {
    await page.waitForTimeout(ms - (ms === 450 ? 0 : 0))
    await page.screenshot({ path: `${out}/abertura-${ms}.png` })
  }
}
// 2) lightbox + RSVP + Pix
{
  const page = await (await browser.newContext(ctxOpts)).newPage()
  page.on('pageerror', (e) => log.push('pageerror ' + e.message))
  await page.goto(url + '?abrir=1')
  await page.waitForTimeout(1500)
  await page.evaluate(() => document.getElementById('galeria').scrollIntoView())
  await page.waitForTimeout(1500)
  await page.tap('#galeria .carousel button')
  await page.waitForTimeout(700)
  await page.screenshot({ path: `${out}/lightbox.png` })
  log.push('lightbox aberto: ' + (await page.locator('[role=dialog]').count()))
  // puxar para baixo para fechar
  const box = await page.locator('[role=dialog] > div').nth(1).boundingBox()
  await page.mouse.move(box.x + box.width / 2, box.y + 300)
  await page.mouse.down()
  for (let i = 1; i <= 10; i++) await page.mouse.move(box.x + box.width / 2, box.y + 300 + i * 25)
  await page.mouse.up()
  await page.waitForTimeout(800)
  log.push('lightbox depois de puxar: ' + (await page.locator('[role=dialog]').count()))

  await page.evaluate(() => document.getElementById('confirmar').scrollIntoView())
  await page.waitForTimeout(1500)
  await page.tap('#confirmar button[type=submit]')
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${out}/rsvp-erro.png` })
  log.push('erro: ' + (await page.locator('#confirmar [role=alert]').textContent()))
  await page.fill('#confirmar input[name=nome]', 'Ana e família')
  await page.tap('#confirmar button[aria-label=Aumentar]')
  await page.tap('#confirmar button[aria-label=Aumentar]')
  await page.fill('#confirmar textarea', 'Parabéns, Sofia! 💜')
  // não deixar navegar de fato para o wa.me
  await page.route('https://wa.me/**', (r) => { log.push('whatsapp: ' + decodeURIComponent(r.request().url())); r.fulfill({ body: 'ok' }) })
  await page.tap('#confirmar button[type=submit]')
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${out}/rsvp-sucesso.png` })
  await page.waitForTimeout(1500)

  await page.goto(url + '?abrir=1')
  await page.waitForTimeout(1200)
  await page.evaluate(() => document.getElementById('presentes').scrollIntoView())
  await page.waitForTimeout(1500)
  await page.tap('#presentes button')
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${out}/pix-copiado.png` })
  log.push('clipboard: ' + (await page.evaluate(() => navigator.clipboard.readText())))
  log.push('ics: ' + (await (await page.request.get(url + 'convite.ics')).text()).split('\r\n').filter((l) => /DTSTART|SUMMARY/.test(l)).join(' | '))
}
// 3) estados da contagem
for (const [nome, agora] of [['hoje', '2026-12-12T10:00'], ['depois', '2026-12-13T10:00']]) {
  const page = await (await browser.newContext(ctxOpts)).newPage()
  await page.goto(`${url}?abrir=1&agora=${agora}`)
  await page.waitForTimeout(1200)
  await page.evaluate(() => document.getElementById('contagem').scrollIntoView())
  await page.waitForTimeout(1800)
  await page.screenshot({ path: `${out}/contagem-${nome}.png` })
}
// 4) desktop com moldura
{
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage()
  await page.goto(url)
  await page.waitForTimeout(2500)
  await page.screenshot({ path: `${out}/desktop.png` })
}
await browser.close()
console.log(log.join('\n'))
