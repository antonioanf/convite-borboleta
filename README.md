# 🦋 Convite Borboleta — Anna Liz · 4 aninhos

Convite de aniversário em formato de site (uma página), feito para ser aberto **no celular** pelo link do WhatsApp.
Visual "iridescente tech": fundo perolado, gradientes holográficos, cartões em bento e borboletas metalizadas, tudo tirado das fotos do ensaio.

- Abertura com borboleta holográfica: as asas abrem e a tela se dissolve num brilho iridescente
- Hero com a foto principal em "cartão holográfico", que inclina com o giroscópio ou o dedo
- Borboletas 3D/2D que fogem do dedo, pousam na foto e **podem ser pegas** (meta: 10)
- Raspadinha prateada na data e velinhas para apagar segurando o dedo (ou soprando)
- Contagem regressiva, local e agenda, galeria com lightbox, confirmação pelo WhatsApp e Pix

**Lighthouse (mobile, build de produção, Lighthouse 13):** Performance 96 · Acessibilidade 100 · Boas práticas 100 · SEO 100.

---

## 1. Começando

Requisitos: Node.js 20 ou mais novo.

```bash
npm install
npm run dev            # abre em http://localhost:5173
npm run build          # gera a pasta dist/ para publicar
npm run preview        # testa o build em http://localhost:4173
```

## 2. O que falta preencher (TODOs)

Tudo fica em **`src/config/convite.ts`**. Procure por `TODO`:

| Campo | O que colocar | Enquanto estiver vazio… |
|---|---|---|
| `festa.endereco` | Ex.: `'Rua Tal, 123 – Bairro, Cidade-PB'` | Aparece "Endereço completo em breve" |
| `festa.linkMapa` | Link do Google Maps (no app: Compartilhar → Copiar link) | O botão "Como chegar" não aparece |
| `rsvp.whatsapp` | Só dígitos, com 55 + DDD: `'5583999999999'` | A confirmação mostra o aviso "WhatsApp ainda não configurado" |
| `rsvp.prazo` | Data limite: `'2027-05-01'` | Some a frase "Confirme até…" |
| `assinatura` | Ex.: `'Com amor, papai e mamãe'` | O rodapé mostra só "Esperamos você!" |
| `pix` | Troque `null` pelo objeto do exemplo comentado | A seção de presentes não aparece |
| `site.url` | Endereço publicado, sem barra no final | **A imagem da prévia no WhatsApp não aparece** |

O horário já está definido: `festa.dataHora` é `2027-05-16T16:00:00-03:00` e `horarioDefinido` é `true`. O cartão mostra 16:00 e a agenda (Google e `.ics`) cria o evento das 16:00 às 20:00 (`duracaoHoras: 4`). Se um dia voltar a ser "a definir", basta pôr `horarioDefinido: false`: o convite mostra "A definir" e a agenda vira evento de dia inteiro.

Depois de mudar data, nome ou local, gere de novo a imagem de prévia: `npm run og`.

## 3. Publicar na Vercel (e atualizar o `site.url`)

1. Crie um repositório **privado** no GitHub e envie o projeto:
   ```bash
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/convite-anna-liz.git
   git push -u origin main
   ```
2. Em [vercel.com](https://vercel.com), clique em **Add New → Project**, importe o repositório e clique em **Deploy**. O Vite é detectado sozinho (build `npm run build`, saída `dist`).
3. Copie o endereço que a Vercel mostrar, ex.: `https://convite-anna-liz.vercel.app`.
   Para um nome mais bonito: **Settings → Domains** (dá para trocar o subdomínio `.vercel.app`).
4. No `convite.ts`, coloque esse endereço em `site.url` (sem barra no final).
5. Rode `npm run og`, faça commit e `git push`. A Vercel publica de novo sozinha em ~1 minuto.
6. Teste a prévia colando o link num chat do WhatsApp. Se a imagem antiga ainda aparecer (cache do WhatsApp), envie com `?v=2` no final.

Sem GitHub: `npx vercel` dentro da pasta (e `npx vercel --prod` para publicar a versão final).

## 4. Paleta (tirada das fotos)

Fica em `convite.paleta`. Os tons de **texto** são calculados em `src/config/tema.ts` (misturas com o roxo profundo) para passar no contraste AA.

| Nome no config | Cor | De onde vem |
|---|---|---|
| `perola` | `#F6F2FA` | parede clara do estúdio (fundo) |
| `lavanda` | `#E4D4F7` | balões claros |
| `lilas` | `#C3A3EE` | vestido / balões médios |
| `violeta` | `#8B5CF6` | balões mais fortes |
| `roxo` | `#3B1C6E` | sombras dos balões — **texto principal** |
| `rosa` | `#F48FB8` | glacê do bolo |
| `magenta` | `#E0428A` | borboleta rosa / número do bolo (acento) |
| `prata`, `holoCiano`, `holoRosa` | `#E9E6F2`, `#A5F3FC`, `#F9A8D4` | balões metalizados (gradiente holográfico) |

## 5. Tipografia

Servidas pelo próprio site (`public/fonts/`, vindas do `@fontsource`), com `preload` e `font-display: swap`:

- **Instrument Serif** (itálico): nome e títulos
- **Manrope** (variável 200–800): textos
- **JetBrains Mono** (variável): números, data, contagem e rótulos em caixa alta

> Nos screenshots do **WebKit do Playwright no Windows**, a Manrope aparece toda fina: esse WebKit de teste não aplica pesos de fontes variáveis. No Chrome e no Safari de verdade (iPhone) os pesos aparecem certos.

## 6. Fotos

As originais ficam em `originais/` e são convertidas para WebP com:

```bash
npm run fotos     # gera public/fotos/<nome>.webp (até 1200 px) e <nome>-600.webp
```

| Arquivo | Onde aparece |
|---|---|
| `anna-deitada` | **Hero** (foto principal) e galeria |
| `anna-girando` | Cartão largo da idade (formato original, sem recorte) e galeria |
| `anna-bolo` | Seção "Sopre as velinhas" e galeria |
| `anna-balao3` | Só na galeria |

- Cada foto tem `largura`, `altura` e `foco` (ponto do recorte, CSS `object-position`) no config.
- As fotos atuais vieram com só ~890 px de largura (comprimidas pelo WhatsApp). Quando chegarem as do estúdio em alta, coloque-as em `originais/` com os mesmos nomes e rode `npm run fotos`.

## 7. Música e sons

- `musica: '/musica/caixinha-de-musica.mp3'` (ou `null` para não ter música nem efeitos sonoros).
- A música só começa depois do toque de abertura, com fade-in.
- Os efeitos (brilho, sininho, "pop") são gerados por código (Web Audio) e respeitam o botão de mudo.

## 8. Interações

| Interação | Como funciona | Fallback |
|---|---|---|
| Rastro de brilho | Arrastar o dedo deixa estrelinhas (~0,6 s) | Máx. 120 partículas (60 no modo leve) |
| Toque solta borboletas | Toque rápido numa área vazia → 2–3 borboletas + vibração | — |
| Pegue as borboletas | Tocar numa borboleta → brilho + contador `n/10`; outra entra em 2–4 s; aos 10, mensagem surpresa | Funciona no 2D e no 3D |
| Foto holográfica | Inclina até 8° com o giroscópio (ou o dedo/mouse) | Parada com reduced-motion |
| Raspadinha da data | Raspar ~60% completa sozinha, com brilho e confete. O cartão tem `touch-action: none`: raspar **não rola a página** | Já revelada com reduced-motion; a data está sempre no HTML; botão "Revelar" para teclado |
| Velinhas | Segurar ~1,3 s (ou Espaço/Enter) apaga; opcional "usar microfone" para soprar | Se negar o microfone, segurar continua funcionando |
| Contagem | Números que viram, bolinha "ao vivo"; no dia vira "É hoje!" | — |
| Confirmação | Botão vira check, borboletas + confete, abre o WhatsApp | Aviso se o WhatsApp não estiver configurado |

## 9. Testes

### Parâmetros na URL

| Parâmetro | Efeito |
|---|---|
| `?modo=leve` / `?modo=3d` | Força as borboletas 2D / 3D |
| `?agora=2027-05-16T10:00` | Simula a data/hora atual ("É hoje!"; `2027-05-17T10:00` mostra o agradecimento) |
| `?abrir=1` | Pula a intro |
| `?teste=1` | Expõe `window.__convite` para os testes automáticos |

### Automáticos (Playwright)

```bash
npx playwright install chromium webkit   # só na primeira vez
npm run dev                               # em outro terminal
npm run shots -- --video                  # screenshots: iPhone 13, Pixel 5, 360x740, 430x932
npm run testes                            # 24 testes de interação
```

`npm run testes` cobre: intro, raspadinha (inclusive que raspar com o dedo não rola a página), velinhas (toque curto não apaga, segurar apaga), pegar 10 borboletas nos modos leve e 3D, toque que solta borboletas, lightbox, RSVP, Pix, `.ics` e os estados da contagem. Os resultados ficam em `screenshots/`.

## 10. Como funciona por dentro

```
index.html                 intro (borboleta holográfica) em HTML/CSS puro: aparece instantaneamente
src/main.ts                entrada pequena: intro + moldura no desktop
src/config/convite.ts      ← TODO o conteúdo
src/config/tema.ts         paleta → variáveis CSS (+ tons de texto com contraste AA)
src/lib/
  butterflyField.ts        simulação das borboletas (voo, fuga do dedo, pouso, captura)
  wingArt.ts               textura metalizada da asa (a mesma no 3D e no 2D)
  holo.ts                  ângulo do brilho holográfico (inclinação + scroll)
  sfx.ts                   efeitos sonoros
  celebrate.ts             confete + borboletas
  datas.ts, calendar.ts    datas formatadas, Google Agenda e .ics (dia inteiro se o horário não estiver definido)
src/components/
  effects/                 Mesh (fundo), EffectsLayer (canvas 2D), Butterflies3D (R3F, lazy)
  sections/                Hero, Destaque, Countdown, Details, Gallery, Lightbox, Velinhas, Rsvp, Pix, Footer
  fun/                     Scratch, Candles, CatchCounter, ProgressBar
  ui/                      Card, HoloPhoto, Press, Icons, Cake, Photo, BottomBar, MusicButton...
```

- **Uma simulação e dois desenhos:** `butterflyField.ts` calcula as borboletas; a cena 3D e o canvas 2D só desenham.
- **Pouso:** elementos com `data-perch="fx,fy,ângulo;..."` viram lugar de pouso (hoje, a moldura da foto principal).
- **Modo leve automático:** com `hardwareConcurrency ≤ 4`, `deviceMemory ≤ 4`, sem WebGL, FPS < 45 na cena 3D ou economia de dados.
- **Desempenho:** DPR máximo 1,5; 3D só depois da intro; animações contínuas só com `transform`/`opacity`; o canvas 2D descansa quando não há nada para desenhar; no máximo 3 elementos com `backdrop-filter` (pill inferior, contagem e confirmação).
- **Desktop:** o próprio convite aparece num `<iframe>` dentro de uma moldura de celular.

### Bibliotecas

Runtime: Vite, React, TypeScript, Tailwind CSS v4, Framer Motion, GSAP + ScrollTrigger, Lenis, React Three Fiber + drei, canvas-confetti (baixado só na primeira comemoração).
Só para desenvolvimento: Playwright (testes e imagem OG), `@fontsource` (fontes), `sharp` (conversão das fotos).
