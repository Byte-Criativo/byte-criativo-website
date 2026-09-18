import type { ItemNavegacao } from "@/components/patterns/site-header"
import type { ColunaRodape } from "@/components/patterns/site-footer"
import type { ItemIndice } from "@/components/patterns/indice-semicolon"

/**
 * O catálogo é rota de revisão: existe em desenvolvimento, em preview e no
 * CI, e some na produção da Vercel. `NODE_ENV` não serve como chave porque o
 * e2e roda contra o build de produção local.
 */
export function catalogoDisponivel(
  env: NodeJS.ProcessEnv | Partial<NodeJS.ProcessEnv>,
): boolean {
  return env.VERCEL_ENV !== "production"
}

export const NAVEGACAO: ItemNavegacao[] = [
  { rotulo: "Trabalhos", href: "/portfolio", secao: "/portfolio" },
  { rotulo: "Serviços", href: "/servicos", secao: "/servicos" },
  { rotulo: "Processo", href: "/processo" },
  { rotulo: "Sobre", href: "/sobre" },
]

export const NAVEGACAO_MENU: ItemNavegacao[] = [
  ...NAVEGACAO,
  { rotulo: "Contato", href: "/contato" },
]

export const COLUNAS_RODAPE: ColunaRodape[] = [
  {
    titulo: "Trabalhos",
    itens: [
      { rotulo: "Underground PB", href: "/portfolio/underground-pb" },
      { rotulo: "Festival Alumiô", href: "/portfolio/festival-alumio" },
      { rotulo: "Todos os trabalhos", href: "/portfolio" },
    ],
  },
  {
    titulo: "Serviços",
    itens: [
      {
        rotulo: "Desenvolvimento de sites",
        href: "/servicos/desenvolvimento-de-sites",
      },
      { rotulo: "Landing pages", href: "/servicos/landing-pages" },
      {
        rotulo: "Sistemas web sob medida",
        href: "/servicos/sistemas-web-sob-medida",
      },
      {
        rotulo: "Automação e integrações",
        href: "/servicos/automacao-e-integracoes",
      },
      { rotulo: "UI/UX design", href: "/servicos/ui-ux-design" },
      { rotulo: "Design de produto", href: "/servicos/design-de-produto" },
      {
        rotulo: "Copywriting para web",
        href: "/servicos/copywriting-para-web",
      },
    ],
  },
  {
    titulo: "Estúdio",
    itens: [
      { rotulo: "Processo", href: "/processo" },
      { rotulo: "Sobre", href: "/sobre" },
      { rotulo: "Contato", href: "/contato" },
      { rotulo: "Privacidade", href: "/privacidade" },
    ],
  },
]

export const ITENS_INDICE: ItemIndice[] = [
  { id: "inicio", rotulo: "Início" },
  { id: "trabalhos", rotulo: "Trabalhos" },
  { id: "forma-de-pensar", rotulo: "Forma de pensar" },
  { id: "o-que-a-byte-faz", rotulo: "O que a Byte faz" },
  { id: "como-um-projeto-anda", rotulo: "Como um projeto anda" },
  { id: "conversa", rotulo: "Conversa" },
]

export const CAPACIDADES = [
  "Programação filtrável",
  "Favoritos salvos no aparelho",
  "Circuito",
  "Memória visual",
]

export const MENSAGEM_GERAL =
  "Olá! Gostaria de conversar sobre um projeto com a Byte Criativo."
