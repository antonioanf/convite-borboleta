# 🦋 Convite Borboleta — convite digital de aniversário

Convite infantil em formato de site (uma página), tema borboletas e paleta roxa, feito para ser aberto **no celular** pelo link do WhatsApp.

- Intro com casulo que racha e solta uma revoada de borboletas
- Borboletas 3D que fogem do dedo, pousam na foto e no nome e reagem à inclinação do celular
- Modo leve automático (borboletas 2D) para aparelhos simples
- Contagem regressiva com cartões que viram, local com mapa e agenda, galeria com lightbox, confirmação pelo WhatsApp, Pix e compartilhar

**Resultado do Lighthouse (mobile, build de produção):** Performance 97 · Acessibilidade 100 · Boas práticas 100 · SEO 100.

---

## 1. Começando

Requisitos: Node.js 20 ou mais novo.

```bash
npm install
npm run dev            # abre em http://localhost:5173
npm run build          # gera a pasta dist/ para publicar
npm run preview        # testa o build em http://localhost:4173
```

## 2. Personalizar para um cliente (só um arquivo)

Todo o conteúdo fica em **`src/config/convite.ts`**. O arquivo é tipado, então o editor avisa se faltar algo.

| Campo | O que é |
|---|---|
| `crianca.nome`, `idade`, `frase` | Nome (fonte script com brilho), idade e frase curta |
| `festa.dataHora` | Formato ISO **com fuso**: `"2026-12-12T16:00:00-03:00"` |
| `festa.duracaoHoras` | Usada na agenda e para saber quando a festa acabou |
| `festa.fusoHorario` | Ex.: `America/Sao_Paulo`, `America/Fortaleza`, `America/Manaus` |
| `festa.local`, `endereco`, `linkMapa` | Local e link do Google Maps (botão "Como chegar") |
| `rsvp.whatsapp` | **Só dígitos**, com DDI e DDD: `5583999999999` |
| `rsvp.prazo` | Data limite para confirmar: `"2026-12-05"` |
| `rsvp.maxPessoas` | Máximo de pessoas por confirmação |
| `assinatura` | Texto do rodapé, ex.: "Com amor, papai e mamãe" |
| `fotoPrincipal`, `galeria` | Fotos (veja a seção 3). Sem `src`, aparece um placeholder bonito |
| `musica` | Caminho do mp3, ou `null` para não ter música |
| `pix` | Chave, tipo, titular e mensagem, ou `null` para esconder |
| `paleta` | As 7 cores do tema (troque o roxo por rosa, azul etc.) |
| `secoes` | Liga/desliga: `contagem`, `local`, `galeria`, `rsvp`, `pix`, `compartilhar` |
| `site.url` | Endereço final publicado (necessário para a prévia no WhatsApp) |
| `site.titulo`, `descricao` | Título e descrição que aparecem na prévia do link |

Depois de editar o config, gere de novo a imagem de prévia e o ícone:

```bash
npm run og     # cria public/og.jpg (1200x630) e public/apple-touch-icon.png
```

## 3. Fotos

Coloque as fotos em `public/fotos/` e aponte no config:

```ts
fotoPrincipal: { src: '/fotos/principal.webp', alt: 'Sofia sorrindo no jardim' },
galeria: [
  { src: '/fotos/ensaio-1.webp', srcPequena: '/fotos/ensaio-1-600.webp', alt: 'Sofia entre flores' },
  // ...
],
```

- O `alt` é obrigatório: é o que leitores de tela leem.
- O `srcPequena` é opcional: uma versão de 600 px que o carrossel usa (mais leve).
- O formato do carrossel é 4:5 (retrato). Fotos em outro formato são recortadas no centro.

### Como comprimir as fotos do estúdio (meta: 150–300 KB cada)

Fotos de estúdio costumam vir com 5–15 MB. É preciso reduzir antes de publicar.

**Opção fácil (no navegador):** [squoosh.app](https://squoosh.app)
1. Arraste a foto.
2. Em *Resize*, use largura **1200 px** (principal e galeria). Para o `srcPequena`, use **600 px**.
3. Em *Compress*, escolha **WebP**, qualidade **72–80**. Ou **AVIF**, qualidade **50–60**, que gera arquivos ainda menores.
4. Confira se o tamanho ficou entre 150 e 300 KB e baixe.

**Opção em lote (terminal):**
```bash
npx sharp-cli -i "originais/*.jpg" -o public/fotos/ -f webp -q 76 resize 1200
npx sharp-cli -i "originais/*.jpg" -o public/fotos/pequenas/ -f webp -q 72 resize 600
```

## 4. Música

Coloque o mp3 em `public/musica/` e ajuste `musica: '/musica/minha-musica.mp3'`.

- A música só começa depois do toque de abertura (regra de todos os navegadores), com fade-in.
- Prefira 64–96 kbps em mono: uma música de 1 minuto fica com uns 500 KB.
- O arquivo de exemplo, `caixinha-de-musica.mp3`, é uma melodia original gerada por código, livre para usar.
- Use só músicas que você tem direito de usar.

## 5. Testar no celular pela rede local

```bash
npm run dev -- --host
```

O terminal mostra um endereço `Network: http://192.168.x.x:5173`. Abra esse endereço no celular conectado ao **mesmo Wi-Fi**.

Algumas coisas só funcionam com HTTPS (o link publicado): inclinação no iPhone, copiar com a API moderna e compartilhar. Sem HTTPS, os fallbacks entram e nada quebra.

### Parâmetros de teste na URL

| Parâmetro | Efeito |
|---|---|
| `?modo=leve` | Força as borboletas 2D (modo de aparelho simples) |
| `?modo=3d` | Força as borboletas 3D |
| `?agora=2026-12-12T10:00` | Simula a data/hora atual: testa "É hoje! 🦋" e o agradecimento (`2026-12-13T10:00`) |
| `?abrir=1` | Pula a intro |

### Testes automáticos (Playwright)

```bash
npx playwright install chromium webkit   # só na primeira vez
npm run dev                               # em outro terminal
npm run shots -- --video                  # screenshots + vídeo: iPhone 13, Pixel 5, 360x740, 430x932
npm run testes                            # lightbox, RSVP, Pix, .ics, "É hoje", moldura desktop
```

Os resultados ficam em `screenshots/`. O script também avisa se aparecer scroll horizontal ou erro no console.

## 6. Publicar

### Vercel
1. Suba a pasta para um repositório no GitHub.
2. Em [vercel.com](https://vercel.com), clique em *Add New → Project* e importe o repositório. O Vite é detectado sozinho (build `npm run build`, saída `dist`).
3. Copie o endereço final (ex.: `https://convite-sofia.vercel.app`), coloque em `site.url` no config e publique de novo.

Sem GitHub: `npx vercel` dentro da pasta.

### Netlify
- Arrastar e soltar: rode `npm run build` e arraste a pasta `dist/` em [app.netlify.com/drop](https://app.netlify.com/drop).
- Ou conecte o repositório com build `npm run build` e pasta `dist`.

### Prévia do link no WhatsApp
- A prévia usa `site.url` + `og.jpg`. **O `site.url` precisa ser o endereço publicado**, senão a imagem não aparece.
- O WhatsApp guarda a prévia em cache. Se mudar a imagem, envie o link com `?v=2` no final.

## 7. Como funciona por dentro

```
index.html                 intro (casulo) em HTML/CSS puro: aparece instantaneamente
src/main.ts                entrada pequena (~5 KB): intro + moldura no desktop
src/config/convite.ts      ← TODO o conteúdo
src/lib/
  butterflyField.ts        simulação das borboletas (voo curvo, fuga do dedo, pouso, rastro)
  wingArt.ts               textura da asa desenhada por código (a mesma no 3D e no 2D)
  perf.ts                  decide 3D x modo leve
  audio.ts                 música com fade (Web Audio, funciona no iOS)
  tilt.ts                  inclinação do celular (com permissão no iOS)
  scroll.ts                Lenis + GSAP ScrollTrigger no mesmo relógio
  calendar.ts              Google Agenda + arquivo .ics
  share.ts, haptics.ts     compartilhar/copiar e vibração, com fallbacks
src/components/
  effects/                 Aurora, EffectsLayer (canvas 2D), Butterflies3D (R3F, lazy)
  sections/                Hero, Countdown, Details, Gallery, Lightbox, Rsvp, Pix, Footer
  ui/                      GlassCard, Press (botões), MusicButton, BottomBar, Photo...
```

- **Uma simulação e dois desenhos:** `butterflyField.ts` calcula onde cada borboleta está. A cena 3D e o canvas 2D só desenham, então trocar de modo no meio da visita é suave.
- **Pouso:** qualquer elemento com `data-perch="fx,fy,ângulo;..."` vira lugar de pouso (frações da largura/altura). Hoje são a moldura da foto e o nome.
- **Modo leve automático:** liga quando o aparelho tem `hardwareConcurrency ≤ 4` ou `deviceMemory ≤ 4`, quando não há WebGL, quando o FPS fica abaixo de 45 nos primeiros 2 s da cena 3D, ou com economia de dados. Com `prefers-reduced-motion`, as animações caem para o mínimo.
- **Carregamento:** o app React é pré-baixado em segundo plano e só executado no toque de abertura. A animação do casulo cobre esse tempo. A cena 3D (three.js) é outro arquivo, baixado só depois da intro e só se o aparelho aguentar.
- **Desktop:** o próprio convite aparece num `<iframe>` dentro de uma moldura de celular. Não existe layout desktop separado.
- **Desempenho:** DPR máximo 1,5, a cena 3D pausa com a aba em segundo plano e as animações CSS pausam fora da tela. No máximo 3 elementos usam `backdrop-filter` (botão de música, contagem e RSVP, que nunca aparecem juntos), e as animações contínuas usam só `transform`/`opacity`.

### Bibliotecas

Obrigatórias: Vite, React, TypeScript, Tailwind CSS v4, Framer Motion, GSAP + ScrollTrigger, Lenis, React Three Fiber + drei, canvas-confetti.

- **drei** é usado no `PerformanceMonitor`: baixa a resolução da cena 3D se o desempenho cair durante o uso.
- **canvas-confetti** só é baixado quando alguém confirma presença.

Únicos extras, só para desenvolvimento (não vão para o site):
- **Playwright**: testes visuais em iPhone/Android e geração da imagem `og.jpg`.
- **@fontsource** (Great Vibes e Outfit): fontes servidas pelo próprio site, sem depender do Google Fonts. Ficam em `public/fonts/` com `font-display: swap` e preload.
