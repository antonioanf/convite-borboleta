/**
 * ============================================================
 *  CONFIGURAÇÃO DO CONVITE
 *  Todo o conteúdo do convite vem deste arquivo.
 *  Para um novo cliente, edite só aqui e troque os arquivos
 *  em /public (fotos e música).
 * ============================================================
 */

export interface Foto {
  /** Caminho a partir de /public, ex.: "/fotos/ensaio-1.webp". Sem `src` = placeholder bonito. */
  src?: string
  /** Versão menor para o carrossel (opcional), ex.: "/fotos/ensaio-1-600.webp" */
  srcPequena?: string
  /** Descrição da foto (acessibilidade). */
  alt: string
}

export interface Paleta {
  /** Fundo mais escuro (noite) */
  noite: string
  /** Fundo secundário */
  ameixa: string
  /** Cor principal */
  violeta: string
  /** Cor principal clara */
  violetaClaro: string
  /** Tons claros */
  lilas: string
  rosa: string
  /** Detalhes e brilhos */
  dourado: string
}

export interface ConviteConfig {
  crianca: {
    nome: string
    idade: number
    /** Frase curta que aparece abaixo da idade */
    frase: string
  }
  festa: {
    /** Data e hora no formato ISO com fuso, ex.: "2026-12-12T16:00:00-03:00" */
    dataHora: string
    /** Duração aproximada (usada na agenda e para saber quando a festa acabou) */
    duracaoHoras: number
    /** Fuso usado para exibir data/hora (IANA) */
    fusoHorario: string
    local: string
    endereco: string
    /** Link do Google Maps (botão "Como chegar") */
    linkMapa: string
  }
  rsvp: {
    /** WhatsApp dos pais: só dígitos, com DDI e DDD. Ex.: 5583999999999 */
    whatsapp: string
    /** Data limite para confirmar (ISO), ex.: "2026-12-05" */
    prazo: string
    /** Máximo de pessoas por confirmação */
    maxPessoas: number
  }
  /** Assinatura no rodapé, ex.: "Com amor, papai e mamãe" */
  assinatura: string
  fotoPrincipal: Foto
  galeria: Foto[]
  /** Caminho do mp3 em /public. `null` = sem música (o botão some). */
  musica: string | null
  /** Pix para presentes. `null` = seção escondida. */
  pix: {
    chave: string
    /** Ex.: "CPF", "E-mail", "Celular", "Aleatória" */
    tipo: string
    titular: string
    mensagem: string
  } | null
  paleta: Paleta
  secoes: {
    contagem: boolean
    local: boolean
    galeria: boolean
    rsvp: boolean
    pix: boolean
    compartilhar: boolean
  }
  /** Usado nas meta tags (prévia do link no WhatsApp) */
  site: {
    /** Endereço final publicado, sem barra no final. Ex.: "https://convite-sofia.vercel.app" */
    url: string
    titulo: string
    descricao: string
    /** Imagem 1200x630 em /public */
    imagemOg: string
  }
}

export const convite: ConviteConfig = {
  crianca: {
    nome: 'Sofia',
    idade: 5,
    frase: 'Venha voar comigo num jardim encantado de borboletas!',
  },
  festa: {
    dataHora: '2026-12-12T16:00:00-03:00',
    duracaoHoras: 4,
    fusoHorario: 'America/Fortaleza',
    local: 'Espaço Jardim Encantado',
    endereco: 'Rua Exemplo, 123 – Centro, Patos-PB',
    linkMapa:
      'https://www.google.com/maps/search/?api=1&query=Rua+Exemplo+123+Centro+Patos+PB',
  },
  rsvp: {
    whatsapp: '5583999999999',
    prazo: '2026-12-05',
    maxPessoas: 10,
  },
  assinatura: 'Com amor, papai e mamãe',
  fotoPrincipal: { alt: 'Sofia sorrindo no jardim' },
  galeria: [
    { alt: 'Sofia entre flores lilás' },
    { alt: 'Sofia com asas de borboleta' },
    { alt: 'Sofia rindo no balanço' },
    { alt: 'Sofia soprando dente-de-leão' },
    { alt: 'Sofia com coroa de flores' },
  ],
  musica: '/musica/caixinha-de-musica.mp3',
  pix: {
    chave: 'sofia.presentes@email.com',
    tipo: 'E-mail',
    titular: 'Maria Exemplo',
    mensagem: 'Sua presença é o nosso maior presente! Se quiser mimar a Sofia, deixamos o Pix aqui.',
  },
  paleta: {
    noite: '#1a0b2e',
    ameixa: '#2d1250',
    violeta: '#7c3aed',
    violetaClaro: '#a855f7',
    lilas: '#d8b4fe',
    rosa: '#f0abfc',
    dourado: '#f5d48a',
  },
  secoes: {
    contagem: true,
    local: true,
    galeria: true,
    rsvp: true,
    pix: true,
    compartilhar: true,
  },
  site: {
    url: 'https://convite-sofia.vercel.app',
    titulo: 'Sofia faz 5 aninhos! 🦋 Você é nosso convidado',
    descricao: 'Sábado, 12 de dezembro, às 16h · Espaço Jardim Encantado. Toque para abrir o convite.',
    imagemOg: '/og.jpg',
  },
}
