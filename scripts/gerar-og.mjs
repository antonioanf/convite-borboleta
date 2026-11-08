/**
 * Gera public/og.jpg (1200x630, prévia do link no WhatsApp) e public/apple-touch-icon.png
 * a partir do src/config/convite.ts. Uso: npm run og
 */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { convite } from '../src/config/convite.ts'

const root = path.resolve(import.meta.dirname, '..')
const font = (f) => `data:font/woff2;base64,${fs.readFileSync(path.join(root, 'public/fonts', f)).toString('base64')}`
const p = convite.paleta
const foto = convite.fotoPrincipal.src ? path.join(root, 'public', convite.fotoPrincipal.src) : null
const fotoData = foto && fs.existsSync(foto) ? `data:image/${path.extname(foto).slice(1)};base64,${fs.readFileSync(foto).toString('base64')}` : null
const fav = fs.readFileSync(path.join(root, 'public/favicon.svg'), 'utf8')
const bfly = (s, x, y, r, o = 1) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${s}px;height:${s}px;transform:rotate(${r}deg);opacity:${o};filter:drop-shadow(0 6px 18px ${p.violetaClaro})">${fav}</div>`
const data = new Date(convite.festa.dataHora)
const dataTxt = new Intl.DateTimeFormat('pt-BR', { timeZone: convite.festa.fusoHorario, weekday: 'long', day: 'numeric', month: 'long' }).format(data)
const hora = new Intl.DateTimeFormat('pt-BR', { timeZone: convite.festa.fusoHorario, hour: '2-digit', minute: '2-digit' }).format(data).replace(':00', 'h').replace(':', 'h')

const html = `<!doctype html><html><head><style>
@font-face{font-family:GV;src:url(${font('great-vibes.woff2')})}
@font-face{font-family:OF;font-weight:100 900;src:url(${font('outfit.woff2')})}
*{margin:0;box-sizing:border-box} body{width:1200px;height:630px;overflow:hidden;font-family:OF;color:#fff;
background:radial-gradient(60% 80% at 25% 30%, ${p.violeta}, transparent 70%),radial-gradient(50% 70% at 85% 80%, ${p.rosa}88, transparent 70%),linear-gradient(140deg, ${p.ameixa}, ${p.noite});position:relative}
.foto{position:absolute;left:90px;top:115px;width:400px;height:400px;border-radius:50%;overflow:hidden;border:4px solid #ffffff55;box-shadow:0 0 0 10px ${p.dourado}55,0 0 90px ${p.violetaClaro};
background:radial-gradient(70% 60% at 30% 25%, ${p.rosa}aa, transparent 70%),linear-gradient(150deg, ${p.violetaClaro}, ${p.violeta} 50%, ${p.ameixa});display:grid;place-items:center}
.foto img{width:100%;height:100%;object-fit:cover}
.txt{position:absolute;left:560px;top:110px;right:60px}
.k{font-size:28px;letter-spacing:.2em;text-transform:uppercase;color:${p.lilas}}
.n{font-family:GV;font-size:170px;line-height:1.05;background:linear-gradient(100deg, ${p.lilas}, ${p.rosa}, ${p.dourado});-webkit-background-clip:text;color:transparent}
.i{font-size:44px;font-weight:300}.i b{color:${p.dourado};font-weight:700;font-size:64px}
.d{margin-top:22px;font-size:30px;color:#ffffffdd}
</style></head><body>
<div class="foto">${fotoData ? `<img src="${fotoData}">` : `<div style="width:170px;height:170px">${fav}</div>`}</div>
${bfly(90, 400, 70, 20)}${bfly(60, 70, 470, -25, .9)}${bfly(70, 1080, 40, 15, .8)}${bfly(50, 1100, 520, -10, .7)}
<div class="txt"><p class="k">Você é nosso convidado</p><p class="n">${convite.crianca.nome}</p>
<p class="i">vai completar <b>${convite.crianca.idade}</b> aninhos</p>
<p class="d">${dataTxt.charAt(0).toUpperCase() + dataTxt.slice(1)} · ${hora}<br>${convite.festa.local}</p></div>
</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(html)
await page.waitForTimeout(300)
await page.screenshot({ path: path.join(root, 'public/og.jpg'), type: 'jpeg', quality: 86 })
await page.setViewportSize({ width: 180, height: 180 })
await page.setContent(`<body style="margin:0;width:180px;height:180px;display:grid;place-items:center;background:linear-gradient(150deg, ${p.ameixa}, ${p.noite})"><div style="width:130px;height:130px">${fav}</div></body>`)
await page.screenshot({ path: path.join(root, 'public/apple-touch-icon.png') })
await browser.close()
console.log('og.jpg e apple-touch-icon.png gerados')
